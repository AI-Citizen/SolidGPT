import os
from solidgpt.definitions import TEST_SKILL_WORKSPACE
from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skills.load_repo import LoadRepo
from solidgpt.src.workskill.skills.run_app import RunApp
from solidgpt.src.workskill.workskill import WorkSkill


def test_execute():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = LoadRepo()
    input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "repo")
    skill.init_config(
        [
            {
                "param_path": input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
        ],
        [
            {
                "id": 1
            } 
        ])
    node = WorkNode("1", skill)
    app.add_node(node)
    app.init_node_dependencies()
    app.execute()


if __name__ == "__main__":
    test_execute()
