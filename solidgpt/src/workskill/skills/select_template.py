import shutil
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *
from solidgpt.src.manager.promptresource import CODE_SUMMARY_V2
from qdrant_client import QdrantClient
from langchain.embeddings import OpenAIEmbeddings
import openai

# To create a code plan for all target files, we should output List<fileName, instruction>
MAX_ONBOARDING_LENGTH = 500


class SelectTemplate(WorkSkill):
    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_SELECT_TEMPLATE
        self.session_id_input = SkillInput(
            "Session ID",
            SkillIOParamCategory.PlainText,
        )
        self.input_user_requirement = SkillInput(
            "User requirement",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.session_id_input)
        self.add_input(self.input_user_requirement)

        self.skill_output = SkillOutput(
            "result message",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)
        self.input_content = None
        self.session_id = None
        self.dest_path = ""
        self.qdrant_path = ""
        self.file_list: list = []


    def _read_input(self):
        self.input_content = self.input_user_requirement.content
        self.session_id = self.session_id_input.content
        self.template_client = QdrantClient(path=os.path.join(SRC_DIR, "tools", "qdrant", "embedding"))
        self.client = QdrantClient(path=os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.session_id))

    def execution_impl(self):
        logging.info("Start to Create Code Plan...")
        top_template = self.__find_top_code()[0]
        self.template_client.close()
        # Check which part of code we actually need to be included into the code plan
        src_path = top_template.payload["path"]
        dest_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "architecture")
        self.copy_all_files(src_path, dest_path)
        self.file_list = self.list_all_dirs(dest_path)
        self.onboard_template()
        return

    def __find_top_code(self):
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedding_query = embeddings_model.embed_query(self.input_user_requirement.content)
        search = self.template_client.search(
            collection_name="templates",
            query_vector=embedding_query,
            limit=1
        )
        return search

    def __summary_file(self, filename):
        py_file = load_from_text(filename, extension="")
        real_name = os.path.basename(filename)
        if py_file is None:
            logging.warn("No python file found")
            return
        python_summary = self.gpt_manager.create_and_chat_with_model(
            prompt=CODE_SUMMARY_V2,
            gpt_model_label="summary_python",
            input_message=py_file,
            model="gpt-3.5-turbo-16k",
        )
        python_summary = python_summary.replace("\n", " ")
        root, ext = os.path.splitext(real_name)
        # save_to_text(os.path.join(self.skill_output1.param_path, f"{root}_{ext}"), python_summary)
        self.__embed_summary(f"{root}{ext}", python_summary, py_file)
        return

    def __embed_summary(self, filename, summary, code):
        payload_dict = {"code": code, "summary": summary, "filename": filename}
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedded_query = embeddings_model.embed_query(summary)
        logging.info(f"Onboarding ID:{self.session_id}\nSave this id to retrieve embedded data later.")
        try:
            self.client.upsert(
                collection_name=self.session_id,
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        except ValueError:
            self.client.recreate_collection(
                collection_name=self.session_id,
                vectors_config=VectorParams(size=len(embedded_query), distance=Distance.COSINE),
            )
            self.client.upsert(
                collection_name=self.session_id,
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        return

    def onboard_template(self):
        file_count = len(self.file_list)
        current_file_idx = 0
        if file_count > MAX_ONBOARDING_LENGTH:
            outbound_message = f"## 👈 Failed to onboard, too many files, change your workspace, limit files count to {MAX_ONBOARDING_LENGTH}"
            logging.warn(outbound_message)
            self._save_to_result_cache(self.skill_output, outbound_message)
        else:
            for file in self.file_list:
                current_file_idx += 1
                if self.callback_func:
                    self.callback_func(current_file_idx, file_count)
                _, ext = os.path.splitext(file)
                if ext in SUPPORT_EXTENSION:
                    self.__summary_file(file)
            self._save_to_result_cache(self.skill_output, f"## 👈 Onboard Finished! Please use the left dropdown to continue")
        self.client.close()
        pass

    @staticmethod
    def get_uuid():
        return str(uuid.uuid4().hex)

    @staticmethod
    def copy_all_files(src, dest):
        ret = []
        visited = set()
        src_len = len(src)
        stack = [src]
        while stack:
            cur_path = stack.pop(0)
            visited.add(cur_path)
            if os.path.isfile(cur_path):
                rest = cur_path[src_len:]
                shutil.copy(cur_path, dest + rest)
                continue
            if os.path.isdir(cur_path):
                rest = cur_path[src_len:]
                if not os.path.exists(dest + rest):
                    os.mkdir(dest + rest)
            neighbors = os.listdir(cur_path)
            for neighbor in neighbors:
                if neighbor not in visited:
                    neighbor_path = os.path.join(cur_path, neighbor)
                    stack.append(neighbor_path)
                    visited.add(neighbor_path)
        return ret

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
