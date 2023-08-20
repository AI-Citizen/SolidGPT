from solidgpt.manager.initializer import Initializer
from solidgpt.workgraph.workgraph import *
from solidgpt.workagent.agents.agent_principalengineer import AgentPrincipalEngineer
from solidgpt.workskill.skills.skill_writeHLD import WriteHLD

TEST_SKILL_WORKSPACE = os.path.join(TEST_DIR, "workskill", "skills", "workspace")

def run_test():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = WriteHLD()
    input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "PRDDocument.md")
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
    agent = AgentPrincipalEngineer(skill)
    node = WorkNode(1, agent)
    app.add_node(node)
    app.init_node_dependencies()
    app.save_data(os.path.join(TEST_SKILL_WORKSPACE, "config", "config_data.json"))
    app.execute()

# It is durable work, please run with sudo and give the right access of keyboard.
# example: sudo PYTHONPATH=/Users/wuqiten/Workplace/solidgpt-workspace/SolidGPT/ python3 test_skill_usenotion.py
if __name__ == "__main__":
    run_test()

