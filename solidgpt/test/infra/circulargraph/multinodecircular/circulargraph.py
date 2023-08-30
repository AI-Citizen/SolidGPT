from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import *


def run_test_with_config():
    app = WorkGraph()
    app.load_data("config/config_data.json")
    app.execute()


Initializer()
run_test_with_config()
