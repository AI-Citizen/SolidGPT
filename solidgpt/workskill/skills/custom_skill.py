import logging
from solidgpt.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.manager.embedding.embeddingmanager import EmbeddingManager
from solidgpt.manager.gptmanager import GPTManager, GPTModel
from solidgpt.manager.promptresource import build_custom_skill_gpt_prompt, build_gpt_prompt
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
        #Embedding resources setup
        self.embedding_manager = EmbeddingManager._instance 
        self.embedding_model_label_list = [item for item in definition.embedding_background_data_list.split(",") if item != ""]   
        self.model = self.__generate_custom_model()
        self.prompt : str

    # Generate the model for the skill based on the definition
    def __generate_custom_model(self) -> GPTModel:
        # Generate principle
        self.prompt = build_custom_skill_gpt_prompt(self.role_assumption, self.definition.instruction, self.definition.principles, self.definition.qa_example)
        # Generate final prompt
        return self.gpt_manager.create_model(
            model="gpt-3.5-turbo",
            prompt=self.prompt,
            gpt_model_label="generate custom model",
        )
    
    def _read_input(self):
        self.input = load_from_md(self.get_input_path(self.skill_input))
        if self.embedding_model_label_list is not None and len(self.embedding_model_label_list) > 0:
            embedding_info = self.__get_embedding_resource_message(f"""{self.prompt}\n{self.input}""")
            self.input = f"""{self.input}\n When responding, 
            please consider the available background information and tailor your answer accordingly. 
            Here is background information: {embedding_info}"""
        logging.info(f"""Skill: {self.definition.skill_name} Input: {self.input}""")
        

    def execution_impl(self):
        model_output = self.model.chat_with_model(self.input)
        if self.definition.output_method == SkillIOParamCategory.PlainText:
            logging.info(model_output)
        else:
            save_to_md2(self.skill_output.param_path, model_output)

    def __get_embedding_resource_message(self, message: str) -> list:
        res = []
        try:
            for model_label in self.embedding_model_label_list:
                res.extend(self.embedding_manager.query_from_embed_model(message, model_label))
            return res
        except:
            logging.error("Failed to query from embedding model")

