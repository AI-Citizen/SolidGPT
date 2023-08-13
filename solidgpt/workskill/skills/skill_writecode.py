from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class WriteCode(WorkSkill):

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_WRITE_CODE
        self.input_design_doc = SkillInput(
            "Design Doc",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_input(self.input_design_doc)
        self.output_source_code = SkillOutput(
            "Code Result",
            SkillIOParamType.StringContent,
            SkillIOParamCategory.SourceCode,
        )
        self.add_output(self.output_source_code)

    def execute(self):
        print("Printing code result here...")
        super().execute()
        self.output_source_code.param_content = "a = a + 1;"
        return
