from solidgpt.src.diy.custom.customizeskillmanager import CustomizeSkillManager
from solidgpt.src.manager.gptmanager import GPTManager


class Initializer:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Initializer, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance

    def __init__(self):
        self._initialize()

    def _initialize(self):
        self.gpt_manager = GPTManager()
        # self.customize_skill_manager = CustomizeSkillManager()
