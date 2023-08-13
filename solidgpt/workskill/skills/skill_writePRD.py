from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class WriteCode(WorkSkill):

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION
        self.input_design_doc = SkillInput(
            "Feature Information",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.input_design_doc)
        self.output_prd = SkillOutput(
            "Product Requirements Documentation",
            SkillIOParamType.StringContent,
            SkillIOParamCategory.ProductRequirementsDocument
        )

    def execute(self):
        print("Printing PRD result here...")
        super().execute()
        self.output_prd.param_content = "Feature requirement is..."
        return
