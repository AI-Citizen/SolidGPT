from solidgpt.src.manager.llamanager import LLAManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE, PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *

class ProductAnalysisLlama(WorkSkill):
    def __init__(self):
        super().__init__()
        self.llm_manager = LLAManager._instance
        self.name = SKILL_NAME_ANALYSIS_PRODUCT
        self.repo_summary = SkillInput(
            "Product Analysis Repo Summary",
            SkillIOParamCategory.PlainText,
        )
        self.additional_info = SkillInput(
            "Product Analysis Additional Info",
            SkillIOParamCategory.PlainText,
        )
        self.requirements = SkillInput(
            "Product Analysis Requirements",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.repo_summary)
        self.add_input(self.additional_info)
        self.add_input(self.requirements)
        self.output_md = SkillOutput(
            "Requirments Analysis Markdown",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_md)
        self.additional_info_content = None
        self.repo_summary_content = None
        self.requirements_content = None

    def _read_input(self):
        if self.additional_info is None:
            self.additional_info_content = self.additional_info.content
        if self.repo_summary_content is None:
            self.repo_summary_content = self.__get_input_content(self.repo_summary)
        if self.requirements_content is None:
            self.requirements_content = self.requirements.content

    def __get_input_content(self, skill_input : SkillInput):
        return load_from_text(self.get_input_path(skill_input), extension=".txt")

    def execution_impl(self):
        print("Generate product analysis here...")
        product_analysis = self._run_product_analysis_model()
        save_to_md2(self.output_md.param_path, product_analysis)
        self._save_to_result_cache(self.output_md, product_analysis)
        return

    def _run_product_analysis_model(self):
        logging.info("Running product analysis model...")
        prompt = build_gpt_prompt(PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION, PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE)
        model = self.llm_manager.create_model(
            prompt=prompt,
            llama_model_label="product_brainstorm",
            temperature=0.01,
        )
        analysis = model.chat_with_model(self.__get_model_input())
        logging.info("Product analysis report: %s", analysis)
        return analysis

    def __get_model_input(self):
        return f'''Requirements: {self.requirements_content} \n Product Instruction: {self.repo_summary_content} \n Product additional background information: {self.additional_info_content}'''
