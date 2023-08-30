import yaml
import os

from solidgpt.definitions import ROOT_DIR

class ConfigReader:
    def __init__(self):
        self.file_path = os.path.join(ROOT_DIR, "src", "configuration", "Configuration.yaml")
        self.data = self.read()

    def read(self):
        with open(self.file_path, 'r') as file:
            data = yaml.safe_load(file)
        return data

    def get_property(self, key):
        return self.data.get(key)
