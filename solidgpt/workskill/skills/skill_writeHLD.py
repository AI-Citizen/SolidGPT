import logging
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import PE_FRONTEND_DESIGN_OUTPUT_TEMPLATE, PE_FRONTEND_ROLE_ASSUPTION, build_gpt_prompt
from solidgpt.saveload.saveload import *
from solidgpt.util.util import *
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class WriteHLD(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION
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
        self.prd_md = load_from_md(input_path)

    def execution_impl(self):
        print("Printing PRD result here...")
        hld_md = self.__run_write_brd_model()
        save_to_md2(self.skill_output.param_path, hld_md)
        return
    
    def __run_write_brd_model(self,):
        logging.info("Running write brd model...")
        prompt = build_gpt_prompt(PE_FRONTEND_ROLE_ASSUPTION, PE_FRONTEND_DESIGN_OUTPUT_TEMPLATE)
        return self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="write_hld",
            input_message=self.prd_md
        )


# Test code will remove later
# project_ai_says = ProductBasicInfo(
#     product_name="AI Says",
#     short_description="Chat with AI that aids in stock analysis and implements trading strategies.",
#     target_audience="Retail investors from China",
#     business_goal="Empower Chinese retail investors using AI",
#     key_features=[
#         "AI analyses stocks' financial reports",
#         "AI analyses key stock indicators like ROE, P/E",
#         "AI assists traders in strategy implementation and backtesting"
#     ],
#     project_timeline={
#         "08.2023": "Development phase",
#         "09.2023": "Alpha release: Analysis of 300 Chinese stocks",
#         "12.2023": "Beta release: Analysis of 5000 Chinese stocks",
#         "2024 Q1": "Official release: Includes trading strategies and backtest features"
#     }
# )

GPTManager()
skill = WriteHLD()
print(skill.execute())
