import logging
from solidgpt.src.diy.custom.customizedskilldefinition import CustomizedSkillDefinition
from solidgpt.src.manager.embedding.embeddingmanager import EmbeddingManager
from solidgpt.src.manager.gptmanager import GPTManager, GPTModel
from solidgpt.src.manager.promptresource import build_custom_skill_gpt_prompt
from solidgpt.src.util.util import load_from_text, save_to_md2
from solidgpt.src.workskill.workskill import *


class CustomSkill(WorkSkill):

    __skill_io_str_map = {
        "SkillIOParamCategory.PlainText": SkillIOParamCategory.PlainText ,
        "SkillIOParamCategory.ProductRequirementsDocument": SkillIOParamCategory.ProductRequirementsDocument,
        "SkillIOParamCategory.BusinessRequirementsDocument": SkillIOParamCategory.BusinessRequirementsDocument,
        "SkillIOParamCategory.HighLevelDesignDocument": SkillIOParamCategory.HighLevelDesignDocument,
    }

    def __init__(self, definition : CustomizedSkillDefinition):
        super().__init__()
        self.name = definition.skill_name
        self.definition = definition
        self.skill_input = SkillInput(
            "Custom Skill Input",
            self.__skill_io_str_map[definition.input_method],
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Custom Skill Output",
            self.__skill_io_str_map[definition.output_method],
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
            model=self.definition.model_name,
            prompt=self.prompt,
            gpt_model_label="generate custom model",
        )
    
    def __improve_output_content(self, content: str) -> str:
        prompt = f"""{self.role_assumption} Enhance the content 
        I provide by adding more details base on your expert knowledge about {self.definition.basic_description}"""
        return self.gpt_manager.create_and_chat_with_model(
            model=self.definition.model_name,
            prompt=prompt,
            input_message=content,
            gpt_model_label="impove output content",
        )

    def _read_input(self):
        self.input = load_from_text(self.get_input_path(self.skill_input))
        if self.embedding_model_label_list is not None and len(self.embedding_model_label_list) > 0:
            embedding_info = self.__get_embedding_resource_message(f"""{self.prompt}\n{self.input}""")
            self.input = f"""{self.input}\n When responding, 
            please consider the available background information and tailor your answer accordingly. 
            Here is background information: {embedding_info}"""
        logging.info(f"""Skill: {self.definition.skill_name} Input: {self.input}""")
        

    def execution_impl(self):
        draft = self.model.chat_with_model(self.input)
        logging.info(f"""Skill: {self.definition.skill_name} Output: {draft}""")
        model_output = self.__improve_output_content(draft)
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

