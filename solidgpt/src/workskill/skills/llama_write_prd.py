from solidgpt.src.manager.llamanager import LLAManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *

class WritePRDLlama(WorkSkill):
    def __init__(self):
        super().__init__()
        self.llm_manager = LLAManager._instance
        self.name = SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION
        self.input_product_key_info = SkillInput(
            "Design Doc",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.input_product_key_info)
        self.output_md = SkillOutput(
            "Write prd Model PRD Result",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_output(self.output_md)
        self.input_content = None

    def _read_input(self):
        input_path = self.get_input_path(self.input_product_key_info)

        # if input is not a path, infer it as a string content
        try:
            self.input_content = load_from_text(input_path, extension=".md")
        except Exception as e:
            self.input_content = self.input_product_key_info.content

    def execution_impl(self):
        print("Printing PRD result here...")
        brain_storm_product_info = self._run_product_brainstorm_model()
        prd = self.__run_write_prd_model(brain_storm_product_info)
        self._save_to_result_cache(self.output_md, prd)
        save_to_md2(self.output_md.param_path, prd)
        return

    def __run_write_prd_model(self, brain_storm_product_info):
        logging.info("Running write prd model...")
        prompt = build_gpt_prompt(PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE)
        return self.llm_manager.create_and_chat_with_model(
            prompt=prompt,
            llama_model_label="write_prd",
            input_message=brain_storm_product_info
        )

    def _run_product_brainstorm_model(self):
        logging.info("Running product brainstorm model...")
        prompt = build_gpt_prompt(PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE)
        model = self.llm_manager.create_model(
            prompt=prompt,
            llama_model_label="product_brainstorm",
            temperature=0.01,
        )
        brainstorm = model.chat_with_model(self.input_content)
        logging.info("Brainstorm result: %s", brainstorm)
        return brainstorm
