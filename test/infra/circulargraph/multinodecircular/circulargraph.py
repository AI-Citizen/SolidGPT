from solidgpt.workgraph.workgraph import *
from solidgpt.manager.gptmanager import GPTManager


def run_test_with_config():
    app = WorkGraph()
    app.load_data("config/config_data.json")
    app.execute()


GPTManager()
run_test_with_config()
