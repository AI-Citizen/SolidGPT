from dataclasses import dataclass
import json

from solidgpt.workskill.skillio import SkillIOParamCategory


@dataclass
class CustomizedSkillDefinition:
    def __init__(self, skill_name, basic_description, instruction, 
                 qa_example, principles, background_data_path, 
                 input_method : SkillIOParamCategory, output_method : SkillIOParamCategory):
        self.skill_name = skill_name
        self.basic_description = basic_description
        self.instruction = instruction
        self.qa_example = qa_example
        self.principles = principles
        self.background_data_path = background_data_path
        self.input_method = input_method
        self.output_method = output_method

    def toDict(self):
        return {
            "skill_name": self.skill_name,
            "basic_description": self.basic_description,
            "instruction": self.instruction,
            "qa_example": self.qa_example,
            "principles": self.principles,
            "background_data_path": self.background_data_path,
            "input_method": self.input_method,
            "output_method": self.output_method
        }