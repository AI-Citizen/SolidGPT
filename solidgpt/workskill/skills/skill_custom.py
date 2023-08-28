import logging
from solidgpt.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.manager.embedding.embeddingmanager import EmbeddingManager
from solidgpt.manager.gptmanager import GPTManager, GPTModel
from solidgpt.manager.promptresource import CUSTOM_GENERATE_PRINCIPLES, build_custom_skill_gpt_prompt, build_gpt_prompt
from solidgpt.util.util import load_from_md, save_to_md2
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class CustomSkill(WorkSkill):

    def __init__(self, definition : CustomizedSkillDefinition, if_add_embedding_info: bool = False, embedding_model_label: str = None):
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
        self.if_add_embedding_info = if_add_embedding_info
        self.embedding_manager = EmbeddingManager._instance
        self.embedding_model_label = embedding_model_label
            
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
        input = load_from_md(self.get_input_path(self.skill_input))
        if self.if_add_embedding_info:
            embedding_info = self.__get_embedding_resource_message(self, f"""{self.prompt}\n{input}""")
            input = f"""{input}\n When responding, 
            please consider the available background information and tailor your answer accordingly. 
            Here is background information: {embedding_info}"""
        return 

    def execution_impl(self):
        model_output = self.model.chat_with_model(self._read_input())
        if self.definition.output_method == SkillIOParamCategory.PlainText:
            logging.info(model_output)
        else:
            save_to_md2(self.skill_output.param_path, model_output)

    def __get_embedding_resource_message(self, message: str) -> list(str):
        try:
            return self.embedding_manager.query_from_embed_model(message, self.embedding_model_label)
        except:
            logging.error("Failed to query from embedding model")

