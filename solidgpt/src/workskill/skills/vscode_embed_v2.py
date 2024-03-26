import logging
import os
import shutil
import openai
import uuid
from solidgpt.src.constants import SKILL_NAME_VSCODE_EMBED2
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.blobmanager import AzureBlobManager
from solidgpt.src.manager.promptresource import CODE_SUMMARY_V2, SUMMARY_CODE_SUMMARY_PYTHON, SUMMARY_PROJECT
from solidgpt.src.util.util import load_from_text, save_to_text
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill
from solidgpt.definitions import LOCAL_STORAGE_WORKSPACE_DIR, SUPPORT_EXTENSION, LOCAL_STORAGE_OUTPUT_DIR

from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, Distance, VectorParams


MAX_ONBOARDING_LENGTH = 500
class VscodeEmbedV2(WorkSkill):
    onboarding_id: str = None

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_VSCODE_EMBED2
        self.gpt_manager = GPTManager._instance
        self.onboarding_id_input = SkillInput(
            "Onboarding ID",
            SkillIOParamCategory.PlainText,
        )
        self.skill_input = SkillInput(
            "base path",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.onboarding_id_input)
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "result message",
            SkillIOParamCategory.PlainText,
        )
        self.summary_output = SkillOutput(
            "Project Summary",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)
        self.add_output(self.summary_output)
        self.base_path: str = ""
        self.file_list: list = []
        self.summary_list: list = []
        self.qdrant_path = ""

    def _read_input(self):
        self.base_path = self.get_input_path(self.skill_input)
        self.file_list = self.list_all_dirs(self.base_path)
        # onboard id is an uuid for vscode user
        self.onboarding_id = self.onboarding_id_input.content
        self.qdrant_path = os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.onboarding_id)
        self.client = QdrantClient(path=self.qdrant_path)
        #self._set_graph_cached_content("qdrant_client", self.client)

    def execution_impl(self):
        logging.info("Start to summary code...")
        current_file_idx = 0
        file_count = len(self.file_list)
        try:
            if file_count > MAX_ONBOARDING_LENGTH:
                outbound_message = f"The number of code files exceeds {MAX_ONBOARDING_LENGTH}, adjust your workspace path to a smaller scope in the Settings page."
                logging.warn(outbound_message)
                self._save_to_result_cache(self.skill_output, outbound_message)
            else:
                self._save_custom_result_to_result_cache(self.file_list)
                for file in self.file_list:
                    current_file_idx += 1
                    if self.callback_func:
                        self.callback_func(current_file_idx, file_count)
                    _, ext = os.path.splitext(file)
                    if ext in SUPPORT_EXTENSION:
                        self.__summary_file(file)
                self.__summary_project()
                self._save_to_result_cache(self.skill_output, f"Indexing Successful. You can now start chatting with Codebase. Be sure to enable **Chat with Codebase** in the Settings. 👉")
        except Exception as e:
            logging.error(f"Error: {e}")
            self.client.close()
            raise e
        self.client.close()
        return

    def __summary_file(self, filename):
        py_file = load_from_text(filename, extension="")
        real_name = os.path.basename(filename)
        if py_file is None:
            logging.warn("No python file found")
            return
        python_summary = self.gpt_manager.create_and_chat_with_model(
            prompt=CODE_SUMMARY_V2,
            gpt_model_label="summary_python",
            input_message=py_file
        )
        python_summary = python_summary.replace("\n", " ")
        self.summary_list.append(python_summary)
        root, ext = os.path.splitext(real_name)
        # save_to_text(os.path.join(self.skill_output1.param_path, f"{root}_{ext}"), python_summary)
        self.__embed_summary(f"{root}{ext}", python_summary, py_file)
        return

    def __summary_project(self):
        all_summary = "\n".join(self.summary_list)
        summary = self.gpt_manager.create_and_chat_with_model(
            prompt=SUMMARY_PROJECT,
            gpt_model_label="summary_readme",
            input_message=all_summary,
        )
        save_to_text(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.onboarding_id, "ProjectSummary"), summary)
        self._save_to_result_cache(self.summary_output, summary)
        return

    def __embed_summary(self, filename, summary, code):
        payload_dict = {"code": code, "summary": summary, "filename": filename}
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedded_query = embeddings_model.embed_query(summary)
        logging.info(f"Onboarding ID:{self.onboarding_id}\nSave this id to retrieve embedded data later.")
        try:
            self.client.upsert(
                collection_name=self.onboarding_id,
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        except ValueError:
            self.client.recreate_collection(
                collection_name=self.onboarding_id,
                vectors_config=VectorParams(size=len(embedded_query), distance=Distance.COSINE),
            )
            self.client.upsert(
                collection_name=self.onboarding_id,
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        return

    @staticmethod
    def get_uuid():
        return str(uuid.uuid4().hex)

    @staticmethod
    def list_all_dirs(path):
        ret = []
        visited = set()
        stack = [path]
        while stack:
            cur_path = stack.pop()
            visited.add(cur_path)
            if os.path.isfile(cur_path):
                ret.append(cur_path)
                if len(ret) > MAX_ONBOARDING_LENGTH:
                    return ret
                continue
            neighbors = os.listdir(cur_path)
            for neighbor in neighbors:
                if neighbor not in visited:
                    neighbor_path = os.path.join(cur_path, neighbor)
                    stack.append(neighbor_path)
                    visited.add(neighbor_path)
        return ret
