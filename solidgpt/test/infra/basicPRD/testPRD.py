from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import *


def run_test():
    app = WorkGraph()
    skill: WorkSkill = WritePRD()
    skill.init_config(
        [
            {
                "param_path": "in/ProductBasicInfo.json",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
        ],
        [
            {
                "id": 1
            }
        ])
    node: WorkNode = WorkNode("0", skill)
    app.add_node(node)
    app.init_node_dependencies()
    app.save_data("config/config_data.json")
    app.execute()


def run_test_with_config():
    app = WorkGraph()
    app.load_data("config/config_data.json")
    app.execute()


Initializer()
run_test_with_config()
