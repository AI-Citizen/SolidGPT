from solidgpt.manager.initializer import Initializer
from solidgpt.workgraph.workgraph import *


def run_test_with_config():
    app = WorkGraph()
    app.load_data("config/config_data.json")
    app.execute()


Initializer()
run_test_with_config()
