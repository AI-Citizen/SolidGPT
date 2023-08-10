from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import WorkSkill


class WriteCode(WorkSkill):

    def __init__(self, inputs_config: dict = None, output_config = None):
        self.name = "Write Code"
        self.input_design_doc = SkillInput(
            None if inputs_config is None else inputs_config[0],
            "Design Doc",
            SkillOutputParamType.STRING,
            "Write a division by 0 error code...",
        )
        self.inputs.append(self.input_design_doc)
        self.output = SkillOutput(
            output_config,
            "Code Result",
            SkillOutputParamType.STRING,
            "a = a/0;",
            -1,
        )
        super().__init__()

    def execute(self):
        print("Printing code result here...")
        super().execute()
        return
