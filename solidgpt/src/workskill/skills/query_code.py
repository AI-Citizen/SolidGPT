import logging
import os

import shutil
import openai
from solidgpt.definitions import EMBEDDING_BLOB_CONTAINER, ROOT_DIR
from solidgpt.src.constants import SKILL_NAME_QUERY_CODE
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.blobmanager import AzureBlobManager
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill
from solidgpt.src.util.util import save_to_text
from langchain.embeddings import OpenAIEmbeddings
from qdrant_client import QdrantClient

Cache_Label_Query_Code = "query_code"

class QueryCode(WorkSkill):
    onboarding_id: str = None

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_QUERY_CODE
        self.gpt_manager = GPTManager._instance
        CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=solidgptstorage;AccountKey=sMOfEXdwF7HwLIOSPSO52oVBHQXnyr4JbBxenbkHc95yNYY81p0u7AFD47lOth+WftQRubd7z9Gg+AStqs7eRw==;EndpointSuffix=core.windows.net"
        self.manager = AzureBlobManager(CONNECTION_STRING)
        self.onboarding_id_input = SkillInput(
            "Onboarding ID",
            SkillIOParamCategory.PlainText,
        )
        self.skill_input = SkillInput(
            "User Input",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.onboarding_id_input)
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Best five code",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)
        self.user_input: str = None
        self.qdrant_path = os.path.join(ROOT_DIR, "src", "tools", "qdrant", "embedding")

    def _read_input(self):
        self.onboarding_id = self.onboarding_id_input.content
        self.user_input = self.skill_input.content
        self.__download_from_azure()
        self.client = QdrantClient(path=os.path.join(self.qdrant_path, self.onboarding_id))

    def execution_impl(self):
        logging.info("Start to search best five code...")

        top_five = self.__find_top_five()
        output_file = self.__format_output(top_five)
        self.graph_cache[Cache_Label_Query_Code] = output_file
        # save_to_text(os.path.join(self.skill_output.param_path), output_file)
        # Windows
        # files = self.list_all_dirs(self.qdrant_path)
        # for file in files:
        #     try:
        #         # File is no longer in use, delete it
        #         os.remove(file)
        #     except Exception as e:
        #         logging.info("Cannot remove file: " + file)
        # Mac/Linux
        shutil.rmtree(self.qdrant_path)
        self.client.close()
        return

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

    def __find_top_five(self):
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedding_query = embeddings_model.embed_query(self.user_input)
        search = self.client.search(
            collection_name=self.onboarding_id,
            query_vector=embedding_query,
            limit=5
        )
        return search

    def __download_from_azure(self):
        files = self.manager.list_blobs(f"{EMBEDDING_BLOB_CONTAINER}")
        for file in files:
            file_name_list = file.split("/")
            if len(file_name_list) <= 0 or file_name_list[0] != self.onboarding_id:
                continue
            download_file_path = os.path.join(self.qdrant_path, *file_name_list)
            mkdir_path = os.path.join(self.qdrant_path, *file_name_list[:-1])
            if not os.path.exists(mkdir_path):
                os.makedirs(mkdir_path)
            with open(file=download_file_path, mode="wb") as download_file:
                download_file.write(self.manager.download_blob(f"{EMBEDDING_BLOB_CONTAINER}", file))
        return

    @staticmethod
    def __format_output(top_five):
        ret_str = []
        for candidate in top_five:
            score = candidate.dict()["score"]
            if score < 0.7:
                continue
            logging.info(score)
            summary = candidate.dict()["payload"]["summary"]
            code = candidate.dict()["payload"]["code"]
            ret_str.append(f"The summary is:\n{summary}\nThe code is:\n```\n{code}\n```")
        return "\n".join(ret_str)