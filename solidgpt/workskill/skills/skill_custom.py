import logging
from solidgpt.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import CUSTOM_GENERATE_PRINCIPLES, build_custom_skill_gpt_prompt, build_gpt_prompt
from solidgpt.util.util import load_from_md, save_to_md2
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class CustomSkill(WorkSkill):

    def __init__(self, definition : CustomizedSkillDefinition):
        super().__init__()
        self.name = definition.skill_name
        self.definition = definition
        self.skill_input = SkillInput(
            "Custom Skill Input",
            definition.input_method,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Custom Skill Output",
            definition.output_method,
        )
        self.add_output(self.skill_output)
        self.gpt_manager = GPTManager()
        self.role_assumption = f'''Assuem you are the expert with {self.definition.skill_name}'''
        self.model = self.__generate_custom_model()


    # Generate the model for the skill based on the definition
    def __generate_custom_model(self):
        # Generate principle
        principles = self.__generate_principles()
        prompt = build_custom_skill_gpt_prompt(self.role_assumption, self.definition.instruction, principles, self.definition.qa_example)
        # Generate final prompt
        return self.gpt_manager.create_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="generate custom model",
        )
    
    def _read_input(self):
        return load_from_md(self.get_input_path(self.skill_input))

    def __generate_principles(self):
        prompt = build_gpt_prompt(self.role_assumption, CUSTOM_GENERATE_PRINCIPLES)

        return self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="generate principles",
            input_message=f'''Task description: {self.definition.basic_description}\n\n 
            Task instruction{self.definition.instruction}'''
        )

    def execution_impl(self):
        model_output = self.model.chat_with_model(self._read_input())
        if self.definition.output_method == SkillIOParamCategory.PlainText:
            logging.info(model_output)
        else:
            save_to_md2(self.skill_output.param_path, model_output)
