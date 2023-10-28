from solidgpt.src.manager.autogenmanager import AutoGenManager
from solidgpt.src.util.util import *
from solidgpt.src.workskill.skills.query_code import Cache_Label_Query_Code
from solidgpt.src.workskill.workskill import *


class AutoGenAnalysis(WorkSkill):
    def __init__(self):
        super().__init__()
        self.autogen_manager = AutoGenManager._instance
        self.name = SKILL_NAME_REPO_CHAT
        self.code_schema = SkillInput(
            "Code Schema",
            SkillIOParamCategory.PlainText,
        )
        self.summary = SkillInput(
            "Product Summary",
            SkillIOParamCategory.PlainText,
        )
        self.requirements = SkillInput(
            "Requirements",
            SkillIOParamCategory.PlainText,
        )
        self.history_context = SkillInput(
            "History Context",
            SkillIOParamCategory.PlainText,
        )
        # self.add_input(self.relatived_files)
        self.add_input(self.code_schema)
        self.add_input(self.summary)
        self.add_input(self.requirements)
        self.add_input(self.history_context)

        self.related_files_content = None
        self.code_schema_content = None
        self.summary_content = None
        self.requirements_content = None

    def _read_input(self):
        # Get from cache or read from file
        self.related_files_content = self._get_graph_cached_content(Cache_Label_Query_Code)
        self.code_schema_content = self.__get_input_content(self.code_schema)
        self.summary_content = self.__get_input_content(self.summary)
        self.requirements_content = self.requirements.content

    def __get_input_content(self, skill_input: SkillInput):
        return load_from_text(self.get_input_path(skill_input), extension=".txt")

    def execution_impl(self):
        self.autogen_manager.construct_agents()
        prompt = self.__get_model_input()
        user_proxy = self.autogen_manager.user_proxy
        assistant = self.autogen_manager.assistnat
        user_proxy.initiate_chat(assistant, prompt)
        return

    def __get_model_input(self):
        return f'''Requirements: {self.requirements_content} \n 
        And the repository information as below
        Project Instruction: {self.summary_content} \n 
        Code schema: {self.code_schema_content} \n
        Related code files: {self.related_files_content} \n
         and always input the Markdown clean format '''
