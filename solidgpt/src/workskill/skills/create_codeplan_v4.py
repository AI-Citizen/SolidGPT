from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import RELATED_CODE_FILTER_ASSUMPTION
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *
from qdrant_client import QdrantClient
from langchain.embeddings import OpenAIEmbeddings
import openai
from pathlib import Path
import re


# To create a code plan for all target files, we should output List<fileName, instruction>
class CreateCodePlanV4(WorkSkill):
    VECTOR_SEARCH_RESULT_LIMIT = 30
    CODE_PLAN = "code_plan"
    RELATED_FILES = "related_files"

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_CREATE_CODE_PLAN
        self.session_id_input = SkillInput(
            "Session ID",
            SkillIOParamCategory.PlainText,
        )
        self.input_user_requirement = SkillInput(
            "User requirement",
            SkillIOParamCategory.PlainText,
        )
        self.codebase_summary = SkillInput(
            "Code base Summary",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.session_id_input)
        self.add_input(self.input_user_requirement)
        self.add_input(self.codebase_summary)
        self.output_code_plan = SkillOutput(
            "Code Plan",
            SkillIOParamCategory.CODE_PLAN,
        )
        self.add_output(self.output_code_plan)
        self.input_content = None
        self.target_file_content_list = []
        self.qdrant_path = ""
        self.code_blocks_str = ""
        self.project_summary_content = ""
        self.dev_design_content = ""
        self.related_code_files_dict = {}

    def _read_input(self):
        self.input_content = self.input_user_requirement.content
        self.project_summary_content = load_from_text(self.get_input_path(self.codebase_summary), extension=".txt")
        self.session_id = self.session_id_input.content
        self.client = QdrantClient(path=os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.session_id))

    def execution_impl(self):
        logging.info("Start to Create Code Plan...")
        top_related_code = self.__find_top_code()
        self.client.close()
        # Check which part of code we actually need to be included into the code plan
        required_code_files_list = self.__related_code_filter(top_related_code)
        self.code_blocks_str = "\n".join([r.format() for r in required_code_files_list])
        save_to_text(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "RelatedCodeFiles"), self.code_blocks_str)
        # Plan the code
        code_plan = self.__generate_code_plan()
        save_to_text(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.session_id, "CodePlan"), code_plan)
        self._save_to_result_cache(self.output_code_plan, code_plan)
        return code_plan

    def __find_top_code(self):
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        # embedding_query = embeddings_model.embed_query(self.input_user_requirement.content)
        self.dev_design_content = self.__generate_dev_design()
        embedding_query = embeddings_model.embed_query(self.dev_design_content)
        search = self.client.search(
            collection_name=self.session_id,
            query_vector=embedding_query,
            limit=self.VECTOR_SEARCH_RESULT_LIMIT
        )
        return search

    def __code_files_format_output(self, top_code):
        ret_str = []
        self.related_code_files_dict = {}
        for candidate in top_code:
            score = candidate.dict()["score"]
            # if score < 0.7:
            #     continue
            logging.info(score)
            summary = candidate.dict()["payload"]["summary"]
            name = candidate.dict()["payload"]["filename"]
            code = candidate.dict()["payload"]["code"]
            code_block = CodeBlock(name=name, code_content=code, summary=summary)
            self.related_code_files_dict[name] = code_block
            ret_str.append(code_block.summary_format())
        return "\n".join(ret_str)

    def __related_code_filter(self, top_code) -> list:
        logging.info("Related Code File Filter...")
        logging.info(f"Draft Related Code Files: {top_code}")
        code_list_str = self.gpt_manager.create_and_chat_with_model(
            prompt=RELATED_CODE_FILTER_ASSUMPTION,
            gpt_model_label="Code File Filter",
            input_message=self.__build_filter_input(top_code=top_code)
        )
        code_list_str = code_list_str.replace(" ", "").replace("[", "").replace("]", "")
        match = re.search('Required:(.*)', code_list_str)
        logging.info(f"Marked files: {code_list_str}")
        if match:
            required_files_name_list = match.group(1).split(',')
        else:
            logging.warn("Failed to fetch the required files list")
            required_files_name_list = []
        result = []
        for r in required_files_name_list:
            try:
                # Your code that might raise an exception
                result.append(self.related_code_files_dict[r])
            except Exception:
                # Log the warning and continue with the next iteration
                logging.warn(f"Failed to get file {r}, because the file is not in the top related files pool")
                continue
        return result

    def __generate_code_plan(self):
        logging.info("Plan...")
        code_plan_stream = self.gpt_manager.create_and_chat_with_model(
            prompt=self.__build_plan_prompt(),
            gpt_model_label="Code Plan",
            input_message=self.__build_plan_input(),
            is_stream=True
        )
        code_plan = ""
        for chunk in code_plan_stream:
            try:
                if chunk.choices[0].delta.content is not None:
                    code_plan += chunk.choices[0].delta.content
                    self.callback_func(code_plan)
            except Exception as e:
                logging.warn(f"Failed to get the delta content with error {e}")
                continue
        return code_plan

    # Will move to prompt manager
    def __build_plan_prompt(self):
        return f"""Assume you are Senior Software engineer. Given Existing Code Files and Requirement, design a detailed code implementation plan. Follow these attentions and rules:
                ATTENTION: Description in the each plan step should be clear, and very detailed. It should be easy for other software engineers to understand and follow to do implementation.
                ATTENTION: If instructed not to change existing code files, use their contents as they are. Create your plan around these files without making any modifications to them.
                ATTENTION: Before starting, decide whether to modify existing files or create new ones. If existing file or class names don't fit your needs, then create a new file.
                RULES:
                1.Check Existing Codes summary, think about the relationship between the existing codes and the requirement.

                2.Review Existing Code: Familiarize yourself with the current code's structure and functionality.

                3.Do your best to plan THIS USE EXISTING CLASS/FUNCTION/VARIABLE/API/OBJECT in Existing Code. IF NO, PLAN TO IMPLEMENT IT

                4.Identify which existing files are as reference, which files are the dependency, which files are as target to be modified. DON'T MODIFY the reference and dependency files.

                OUTPUT FORMATE
                -----------------
                Step:[Step Number]
                Change Description: [Description]
                File Affected: [Existing file name or 'New File: [File Name]']
        """

    def __build_plan_input(self):
        return f"""
        Existing Code Files: {self.code_blocks_str}
        Requirement: {self.input_content}
        Development Design: {self.dev_design_content}"""

    def __build_filter_input(self, top_code):
        return f"""Requirement: {self.input_user_requirement.content} Code Files: {self.__code_files_format_output(top_code)}"""

    def __build_dev_design_prompt(self):
        return f"""Assume you are Senior Software engineer. Given the summary of code base and Requirement, design a high level design of code implementation. Follow these attentions and rules:
                ATTENTION: Description in the each plan step should be clear, and very detailed. It should be easy for other software engineers to understand and follow to do implementation.
                ATTENTION: Before starting, decide how many files are needed to satisfy the requirement. Give each file a filename that best describes what the file mean.
                RULES:
                1.Check Existing Codes summary, think about the relationship between the existing codes and the requirement.

                2.Do your best to plan this design USE EXISTING CLASS/FUNCTION/VARIABLE/API/OBJECT in your knowledge. IF NO, PLAN TO IMPLEMENT IT

                3.Identify which files are references, which files are the dependency. Make sure to include all the needed references when creating a new file.
                OUTPUT FORMAT
                -----------------
                Step:[Step Number]
                Change Description: [Description]
                File Name: [File Name]
                Code Snippet: [Real Code]
        """

    def __build_dev_design_input(self):
        return f"""
        Project Summary: {self.project_summary_content}
        Requirement: {self.input_content}"""


    def __generate_dev_design(self):
        dev_design = self.gpt_manager.create_and_chat_with_model(
            prompt=self.__build_dev_design_prompt(),
            gpt_model_label="Code Plan",
            input_message=self.__build_dev_design_input(),
            is_stream=True
        )
        return dev_design


class CodeBlock():
    name: str
    code_content: str
    summary: str

    def __init__(self, name, code_content, summary) -> None:
        self.name = name
        self.code_content = code_content
        self.summary = summary

    def summary_format(self) -> str:
        return f"""File name: {self.name} \n Summary: {self.summary}"""

    def code_content_format(self) -> str:
        return f"""File name: {self.name} \n Code: {self.code_content}"""

    def format(self) -> str:
        return f"""File name: {self.name} \n Summary: {self.summary} \n Code: {self.code_content}"""
