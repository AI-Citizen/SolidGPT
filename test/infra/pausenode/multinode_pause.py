from solidgpt.orchestration.orchestration import *
from solidgpt.manager.gptmanager import GPTManager


def run_test_with_config():
    app = Orchestration()
    app.load_data("config/config_data.json")
    app.execute()


GPTManager()
run_test_with_config()
