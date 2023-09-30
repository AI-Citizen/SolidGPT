from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import *
from solidgpt.src.util.util import save_to_md2
from solidgpt.src.workskill.workskill import *

class ProvideTechSolution(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_PROVIDE_TECH_SOLUTION
        self.requirements = SkillInput(
            "Tech Requirements",
            SkillIOParamCategory.PlainText,
        )
        self.background_code = SkillInput(
            "Background Code",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.requirements)
        self.add_input(self.background_code)
        self.output_md = SkillOutput(
            "Tech solution",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_md)
        self.requirements_content = None
        self.background_code_content = None

    def _read_input(self):
        # Get from cache or read from file
        self.requirements_content = self.requirements.content
        self.background_code_content = self.__get_input_content(self.background_code)

    def __get_input_content(self, skill_input : SkillInput):
        if skill_input.get_input_path() is None or skill_input.get_input_path() == '':
            return ''
        full_path = self.get_input_path(skill_input)
        with open(full_path, "r") as md_file:
            content = md_file.read()
            return content

    def execution_impl(self):
        print("Generate tech solution here...")
        tech_solution = self._run_tech_solution_model()
        save_to_md2(self.output_md.param_path, tech_solution)
        return
    
    def _run_tech_solution_model(self):
        logging.info("Running generate tech solution model...")

        model = self.gpt_manager.create_model(
            prompt=SDE_TECH_SOLUTION_ASSUMPTION,
            gpt_model_label="tech solution",
            temperature=0.01,
        )
        analysis = model.chat_with_model(self.__get_model_input())
        return analysis
    
    def __get_model_input(self):
        return f'''Requirements: {self.requirements_content} \n ''' + f'''Background code: {self.background_code_content} \n'''