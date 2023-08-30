import os
from solidgpt.definitions import TEST_SKILL_WORKSPACE
from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workagent.agents.agent_softwaredeveloper import AgentSoftwareDeveloper
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skills.write_subpage import WriteSubPage
from solidgpt.src.workskill.workskill import WorkSkill


def run_test():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = WriteSubPage()
    input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "Create_Kanban_Board_2.md")
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
    agent = AgentSoftwareDeveloper(skill)
    node = WorkNode(1, agent)
    app.add_node(node)
    app.init_node_dependencies()
    app.execute()


if __name__ == "__main__":
    run_test()