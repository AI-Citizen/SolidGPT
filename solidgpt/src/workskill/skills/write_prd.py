from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *


class ProductBasicInfo:
    def __init__(self, product_name, short_description, target_audience, business_goal, key_features, project_timeline):
        self.product_name = product_name
        self.short_description = short_description
        self.target_audience = target_audience
        self.business_goal = business_goal
        self.key_features = key_features
        self.project_timeline = project_timeline

    def display_info(self)->str:
        key_features_str = "\n".join([f"- {feature}" for feature in self.key_features])
        timeline_str = "\n".join([f"{date}: {activity}" for date, activity in self.project_timeline.items()])
        full_info = (
            f"Product Name: {self.product_name}\n"
            f"Short Description: {self.short_description}\n"
            f"Target Audience: {self.target_audience}\n"
            f"Business Goal: {self.business_goal}\n"
            f"Key Features:\n{key_features_str}\n"
            f"Project Timeline:\n{timeline_str}"
        )
        return full_info


class WritePRD(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION
        self.input_product_key_info = SkillInput(
            "Design Doc",
            SkillIOParamCategory.SourceCode,
        )
        self.add_input(self.input_product_key_info)
        self.output_md = SkillOutput(
            "Write prd Model PRD Result",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_output(self.output_md)
        self.input_product_information = None

    def _read_input(self):
        input_path = self.get_input_path(self.input_product_key_info)
        obj = load_from_json(input_path)
        project_ai_says = ProductBasicInfo(
            product_name=obj["product_name"],
            short_description=obj["short_description"],
            target_audience=obj["target_audience"],
            business_goal=obj["business_goal"],
            key_features=obj["key_features"],
            project_timeline=obj["project_timeline"],
        )
        self.input_product_information = project_ai_says

    def execution_impl(self):
        print("Printing PRD result here...")
        brain_storm_product_info = self._run_product_brainstorm_model()
        prd = self.__run_write_prd_model(brain_storm_product_info)
        save_to_md2(self.output_md.param_path, prd)
        return
    
    def __run_write_prd_model(self, brain_storm_product_info):
        logging.info("Running write prd model...")
        prompt = build_gpt_prompt(PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE)
        return self.gpt_manager.create_and_chat_with_model(
            prompt=prompt,
            gpt_model_label="write_prd",
            input_message=brain_storm_product_info
        )
    
    def _run_product_brainstorm_model(self):
        logging.info("Running product brainstorm model...")
        prompt = build_gpt_prompt(PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE)
        model = self.gpt_manager.create_model(
            prompt=prompt,
            gpt_model_label="product_brainstorm",
            temperature=0.01,
        )
        brainstorm = model.chat_with_model(self.input_product_information.display_info())
        logging.info("Brainstorm result: %s", brainstorm)
        return brainstorm


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
#
# GPTManager()
# skill = WritePRD(project_ai_says)
# print(skill.execute())
