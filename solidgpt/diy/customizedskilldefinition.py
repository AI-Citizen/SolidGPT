from dataclasses import dataclass


@dataclass
class CustomizedSkillDefinition:
    def __init__(self, skill_name, basic_description, instruction, qa_example, background_data_path):
        self.skill_name = skill_name
        self.basic_description = basic_description
        self.instruction = instruction
        self.qa_example = qa_example
        self.background_data_path = background_data_path