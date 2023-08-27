

import re
import logging
import os
from definitions import ROOT_DIR
from solidgpt.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import CUSTOM_GENERATE_LIST_SKILLS_OUTPUT_FORMAT, CUSTOM_GENERATE_SKILL_JSON_OUTPUT_FORMAT, CUSTOM_GENERATE_SKILL_JSON_ROLE_ASSUMPTION, build_gpt_prompt, get_custom_skills_assumption_role_prompt
from solidgpt.util.util import save_to_json

class CustomSkillGenerator:
    def __init__(self):
        self.gpt_manager = GPTManager._instance
        self.cache = {}

    def generate_custom_skill(self, business:str):
        logging.info("Generating custom skill...")
        skills = self.__list_essential_skill_list(business)
        for skill in skills:
            self.__get_custom_skill_detail(skill)
            custom_skill_definition = self.__format_custom_skill(skill)
            logging.info(custom_skill_definition)
        return
        
    def __list_essential_skill_list(self, business:str):
        role_prompt = get_custom_skills_assumption_role_prompt(business)
        prompt = build_gpt_prompt(role_assumption=role_prompt, output_format=CUSTOM_GENERATE_LIST_SKILLS_OUTPUT_FORMAT)
        skill_list : str = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="list_essential_skill_list",
            input_message="Always use && to separate each skill ",
            temperature=0
        )
        skill_list_tmp = skill_list.split("&&")
        if len(skill_list_tmp) < 2:
            lines = skill_list.split('\n')
            skill_list_tmp = [line for line in lines if re.match(r'^\d+\.', line)]

        skill_list_final = [item for item in skill_list_tmp if not item.isdigit() and item != '']
        return skill_list_final

    
    def __get_custom_skill_detail(self, skill_short_description:str):
        logging.info(f"""Explore skill {skill_short_description}""")
        detail = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=f"""I want to create the {skill_short_description} AI agent, 
            Can you list more detail about the {skill_short_description}?
            can you give me an input and output format of agent?
            And also give an instruction of how to do/implement {skill_short_description} step by step""",
            gpt_model_label="get_custom_skills_detail",
            input_message=skill_short_description
        )
        qa_example = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt= f"""Your idea for skill {skill_short_description} is: {detail}. Directly response no extra words """,
            gpt_model_label="get_custom_skills_example",
            input_message="""Can you give a example Input and output base on your idea."""
        )
        self.cache["detail"] = detail
        self.cache["qa_example"] = qa_example
        

    
    def __format_custom_skill(self, skill_short_description:str):
        if self.cache.get("qa_example") is None or self.cache.get("detail") is None:
            logging.error("Please run list_essential_skill_list or get_custom_skill_detail first")
        
        skill_name = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=f"""Base on the skill short description, give me short clear Camel Case no space name . For example - Quantitative Analyst, Programming, Write PRD etc.""",
            gpt_model_label="format_custom_skill",
            input_message=f'''Describtion: {skill_short_description}'''
        )

        definition = CustomizedSkillDefinition(
            skill_name = skill_name,
            basic_description = skill_short_description,
            instruction= self.cache["detail"],
            qa_example = self.cache["qa_example"],
            background_data_path= "", 
            input_method= "SkillIOParamCategory.PlainText", 
            output_method= "SkillIOParamCategory.PlainText"
        )

        save_to_json(definition.toDict(), os.path.join(ROOT_DIR, "localstorage", "customizedskilldefinition", f"{skill_name}.json"))

        
        # Clean cache
        self.cache = {}
        return 


GPTManager()
c = CustomSkillGenerator()
c.generate_custom_skill("Product Manager")