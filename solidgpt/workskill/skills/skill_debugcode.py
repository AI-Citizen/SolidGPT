from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import WorkSkill


class DebugCode(WorkSkill):

    def __init__(self, inputs_config: dict = None, output_config = None):
        super().__init__()
        self.name = "Debug Code"
        self.input_source_code = SkillInput(
            None if inputs_config is None else inputs_config[0],
            "Source Code",
            SkillOutputParamType.STRING,
            "a = a/0;",
        )
        self.inputs.append(self.input_source_code)
        self.input_error_message = SkillInput(
            None if inputs_config is None else inputs_config[1],
            "Error Message",
            SkillOutputParamType.STRING,
            "ZeroDivisionError: division by zero.",
            optional=True,
        )
        self.inputs.append(self.input_error_message)
        self.output = SkillOutput(
            output_config,
            "Debug Result",
            SkillOutputParamType.STRING,
            "The bug is caused by...",
            -1,
        )

    def execute(self):
        super().execute()
        "Printing debug result here..."
        return
