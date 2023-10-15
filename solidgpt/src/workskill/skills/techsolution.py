from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE, PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, SDE_TECH_SOLUTION_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.skills.query_code import Cache_Label_Query_Code
from solidgpt.src.workskill.workskill import *

class ProvideTechSolution(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_PROVIDE_TECH_SOLUTION
        # self.relatived_files = SkillInput(
        #     "Relatived Files",
        #     SkillIOParamCategory.PlainText,
        # )
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
        #self.add_input(self.relatived_files)
        self.add_input(self.code_schema)
        self.add_input(self.summary)
        self.add_input(self.requirements)
        self.output_md = SkillOutput(
            "Tech Solution Markdown",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_md)
        self.relatived_files_content = None
        self.code_schema_content = None
        self.summary_content = None
        self.requirements_content = None

    def _read_input(self):
        # Get from cache or read from file
        self.relatived_files_content = self._get_graph_cached_content(Cache_Label_Query_Code)
        self.code_schema_content = self.__get_input_content(self.code_schema)
        self.summary_content = self.__get_input_content(self.summary)
        self.requirements_content = self.requirements.content

    def __get_input_content(self, skill_input : SkillInput):
        return load_from_text(self.get_input_path(skill_input), extension=".txt")

    def execution_impl(self):
        print("Generate product analysis here...")
        solution = self.__run_provide_tech_solution_model_model()
        save_to_md2(self.output_md.param_path, solution)
        self._save_to_result_cache(self.output_md, solution)
        return
    
    def __run_provide_tech_solution_model_model(self):
        logging.info("Running provide tech solution model...")
        model = self.gpt_manager.create_model(
            prompt=SDE_TECH_SOLUTION_ASSUMPTION,
            gpt_model_label="sde_tech_solution",
            temperature=0.01,
            model="gpt4",
        )
        solution = model.chat_with_model(self.__get_model_input())
        return solution
    
    def __get_model_input(self):
        return f'''Requirements: {self.requirements_content} \n 
        Project Instruction: {self.summary_content} \n 
        Code schema: {self.code_schema_content} \n
        Relatived code files: {self.relatived_files_content} \n'''