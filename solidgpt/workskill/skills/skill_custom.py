from solidgpt.diy.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class CustomSkill(WorkSkill):

    def __init__(self, definition : CustomizedSkillDefinition):
        super().__init__()
        self.name = definition.skill_name
        self.definition = definition
        self.skill_input = SkillInput(
            "Custom Skill Input",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Custom Skill Output",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)

    # Generate the model for the skill based on the definition
    def generate_custom_model(self):
        return

    def execution_impl(self):
        return
