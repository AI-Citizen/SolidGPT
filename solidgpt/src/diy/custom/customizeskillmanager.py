import logging
import os
from solidgpt.definitions import *
from solidgpt.src.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.src.util.util import load_from_json
from solidgpt.src.workskill.skills.custom_skill import CustomSkill

class CustomizeSkillManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance
    
    def __init__(self, custom_skill_definition_folder_path=os.path.join(LOCAL_STORAGE_DIR, 'customizedskilldefinition')):
        self.customized_skills_map: dict[str, CustomSkill] = {}
        self.custom_skill_definition_folder_path = custom_skill_definition_folder_path
        self.__load_customized_skills()

    def get_customzied_skill(self, skill_name: str)-> CustomSkill:
        skill = self.customized_skills_map.get(skill_name)
        if skill is None:
            logging.error(f"Error, Customized skill {skill_name} is not found.")
        return skill
    
    def __load_customized_skills(self):
        # load all of the customized skills josn files
        skill_definitions = self.__load_customzied_skill_from_folder()
        for skill_definition in skill_definitions:
            skill = self.__load_customized_skill(skill_definition)
            self.customized_skills_map[skill_definition.skill_name] = skill
        return
    
    def __load_customized_skill(self, skill_definition: CustomizedSkillDefinition)-> CustomSkill:
        # load all of the customized skills josn files
        return CustomSkill(skill_definition)
    
    def __load_customzied_skill_from_folder(self):
        # Get a list of all files in the folder
        file_list = os.listdir(self.custom_skill_definition_folder_path)

        # Filter JSON files from the list
        json_files = [file for file in file_list if file.endswith('.json')]
        logging.info(f"Found {json_files} json files in {self.custom_skill_definition_folder_path}")
        
        # Load JSON data from each JSON file
        customized_skills_definition: list(CustomizedSkillDefinition)= []
        for json_file in json_files:
            customized_skills_definition.append(CustomizedSkillDefinition(**load_from_json(os.path.join(self.custom_skill_definition_folder_path, json_file))))
        return customized_skills_definition