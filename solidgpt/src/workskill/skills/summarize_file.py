import logging
import os
import shutil
import time

import openai
import uuid
from solidgpt.src.constants import SKILL_NAME_SUMMARY_FILE
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.blobmanager import AzureBlobManager
from solidgpt.src.manager.promptresource import SUMMARY_CODE_SUMMARY_PYTHON
from solidgpt.src.util.util import load_from_text, save_to_text
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill
from solidgpt.definitions import EMBEDDING_BLOB_CONTAINER, ROOT_DIR

from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, Distance, VectorParams


class SummaryFile(WorkSkill):
    Allowed_Extensions = [".py", ".js", ".jsx", "html", ".css", "ts", "tsx"]
    Seperator = "**-****-****-****-**"
    # Cache_Label_Summary_File = "summary_python_file"
    onboarding_id: str = None

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_SUMMARY_FILE
        self.gpt_manager = GPTManager._instance
        self.onboarding_id_input = SkillInput(
            "Onboarding ID",
            SkillIOParamCategory.PlainText,
        )
        self.skill_input = SkillInput(
            "Plain code text",
            SkillIOParamCategory.CODE_PLAIN_TEXT,
        )
        self.add_input(self.onboarding_id_input)
        self.add_input(self.skill_input)
        self.skill_output1 = SkillOutput(
            "Single python file summary",
            SkillIOParamCategory.PlainText,
        )
        self.skill_output2 = SkillOutput(
            "Single python code",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output1)
        self.add_output(self.skill_output2)
        self.repo_txt: str = None
        self.file_list: list = []
        CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=solidgptstorage;AccountKey=sMOfEXdwF7HwLIOSPSO52oVBHQXnyr4JbBxenbkHc95yNYY81p0u7AFD47lOth+WftQRubd7z9Gg+AStqs7eRw==;EndpointSuffix=core.windows.net"
        self.manager = AzureBlobManager(CONNECTION_STRING)
        self.qdrant_path = os.path.join(ROOT_DIR, "src", "tools", "qdrant", "embedding")
        
        

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.repo_txt = load_from_text(input_path, extension=".txt")
        self.onboarding_id = self.onboarding_id_input.content
        # self.__download_from_azure(self.onboarding_id)
        self.client = QdrantClient(path=os.path.join(self.qdrant_path, self.onboarding_id))
        

    def execution_impl(self):
        logging.info("Start to summary code...")
        self.__extract_lines_after_sequence()
        file_count = len(self.file_list)
        current_file_idx = 0
        for file in self.file_list:
            current_file_idx += 1
            if self.callback_func:
                self.callback_func(current_file_idx, file_count)
            if file[-3:] in self.Allowed_Extensions:
                self.__summary_file(file)
        self.client.close()
        self.__upload_to_azure()
        return

    def __summary_file(self, filename):
        py_file = self.__extract_file_content(filename)
        real_name = filename[:-3]
        real_name = real_name.translate(str.maketrans({"\\": "_", "/": "_"}))
        # save_to_text(os.path.join(self.skill_output1.param_path, f"{real_name}%%CODE%%"), py_file)
        if py_file is None:
            logging.warn("No python file found")
            return
        python_summary = self.gpt_manager.create_and_chat_with_model(
            prompt=SUMMARY_CODE_SUMMARY_PYTHON,
            gpt_model_label="summary_python",
            input_message=py_file
        )
        python_summary = python_summary.replace("\n", " ")
        logging.info(f"Summary of python file: {python_summary}")
        # save_to_text(os.path.join(self.skill_output1.param_path, f"{real_name}%%SUMMARY%%"), python_summary)
        self.__embed_summary(real_name, python_summary, py_file)
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

    def __download_from_azure(self, onboarding_id):
        collections = self.manager.list_blobs(f"{EMBEDDING_BLOB_CONTAINER}")
        print(collections)
        if onboarding_id in collections:
            files = self.manager.list_blobs(f"{EMBEDDING_BLOB_CONTAINER}/{onboarding_id}")
            for file in files:
                file_name_list = file.split("/")
                download_file_path = os.path.join(self.qdrant_path, *file_name_list)
                mkdir_path = os.path.join(self.qdrant_path, *file_name_list[:-1])
                if not os.path.exists(mkdir_path):
                    os.makedirs(mkdir_path)
                with open(file=download_file_path, mode="wb") as download_file:
                    download_file.write(self.manager.download_blob(f"{EMBEDDING_BLOB_CONTAINER}/{onboarding_id}", file))
        return

    def __upload_to_azure(self):

        # Sample Usage
        # manager.upload_blob("repos", "folder/sample.txt", "This is a sample text.", overwrite=True)
        # print(manager.list_blobs("repos"))
        files = self.list_all_dirs(self.qdrant_path)
        for file in files:
            relative_path = file.split(os.path.join(self.qdrant_path, ""))[1].replace("\\", "/")
            with open(file, mode="rb") as data:
                self.manager.upload_blob(f"{EMBEDDING_BLOB_CONTAINER}", relative_path, data, overwrite=True)

        for file in files:
            try:
                # File is no longer in use, delete it
                os.remove(file)
            except Exception as e:
                logging.info("Cannot remove file: " + file)
        return

    def __extract_lines_after_sequence(self):
        lines = self.repo_txt.split('\n')
        capture = False
        captured_lines = []
        for line in lines:
            if capture:
                captured_lines.append(line)
                capture = False
            if self.Seperator in line:
                capture = True
        self.file_list = captured_lines
        return None

    def __extract_file_content(self, filename):
        # Split the text by the sequence
        blocks = self.repo_txt.split(self.Seperator)
        for block in blocks:
            # Check the first line of each block
            first_line = block.strip().split('\n')[0]

            if first_line.lower() == filename:
                # Remove the first line (filename) and return the rest
                return '\n'.join(block.strip().split('\n')[1:])
        return None  # If no desired file is found

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
                continue
            neighbors = os.listdir(cur_path)
            for neighbor in neighbors:
                if neighbor not in visited:
                    neighbor_path = os.path.join(cur_path, neighbor)
                    stack.append(neighbor_path)
                    visited.add(neighbor_path)
        return ret
