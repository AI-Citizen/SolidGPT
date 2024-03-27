import yaml
import os

from solidgpt.definitions import ROOT_DIR

class ConfigReader:
    # gpt-4-1106-preview, gpt-3.5-turbo-16k
    config_map = { "openai_model": "gpt-3.5-turbo-16k" }
    def __init__(self):
        # self.file_path = os.path.join(ROOT_DIR, "src", "configuration", "Configuration.yaml")
        # config_path = "configuration.yaml"  # This should match the expected path in your code.
        pass

    def read(self):
        # with open(self.file_path, 'r') as file:
        #     data = yaml.safe_load(file)
        # return data
        pass

    def get_property(self, key):
        return self.config_map.get(key, "")
    
    def set_default_openai_model(self, model:str):
        self.__set_property("openai_model", model)
    
    def __set_property(self, key, value):
        self.config_map[key] = value
