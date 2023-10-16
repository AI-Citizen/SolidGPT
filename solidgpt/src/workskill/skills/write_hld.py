from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PE_FRONTEND_DESIGN_OUTPUT_TEMPLATE, PE_FRONTEND_ROLE_ASSUPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *


class WriteHLD(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_WRITE_HLD
        self.skill_input = SkillInput(
            "Design Doc",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Write HLD Result",
            SkillIOParamCategory.HighLevelDesignDocument,
        )
        self.add_output(self.skill_output)
        self.prd_md : str = None

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.prd_md = load_from_text(input_path)

    def execution_impl(self):
        print("Printing HLD result here...")
        hld_md = self.__run_write_hld_model()
        save_to_md2(self.skill_output.param_path, hld_md)
        self._save_to_result_cache(self.skill_output, hld_md)
        return
    
    def __run_write_hld_model(self,):
        logging.info("Running write hld model...")
        prompt = build_gpt_prompt(PE_FRONTEND_ROLE_ASSUPTION, PE_FRONTEND_DESIGN_OUTPUT_TEMPLATE)
        return self.gpt_manager.create_and_chat_with_model(
            prompt=prompt,
            gpt_model_label="write_hld",
            input_message=self.prd_md
        )
