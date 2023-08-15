from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class DebugCode(WorkSkill):

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_DEBUG_CODE
        self.input_source_code = SkillInput(
            "Source Code",
            SkillIOParamCategory.SourceCode,
        )
        self.add_input(self.input_source_code)
        self.input_error_message = SkillInput(
            "Error Message",
            SkillIOParamCategory.PlainText,
            optional=True,
        )
        self.add_input(self.input_error_message)
        self.output_error_analysis = SkillOutput(
            "Debug Result",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_error_analysis)

    def execution_impl(self):
        print("Printing debug result here...")
        self.output_error_analysis.param_path = "This code is wrong because..."
        return
