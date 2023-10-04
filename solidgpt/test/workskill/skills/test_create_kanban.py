from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import *
from solidgpt.src.workskill.skills.create_kanban import CreateKanBan

def run_test():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = CreateKanBan()
    input_path = os.path.join(TEST_DIR, "workskill", "skills", "out", "1", "Write_HLD_Result_1.md")
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
                "id": 2
            } 
        ])
    node = WorkNode("1", skill)
    app.add_node(node)
    app.init_node_dependencies()
    app.save_data(os.path.join(TEST_DIR, "workskill", "skills", "workspace", "config", "config_data.json"))
    app.execute()

if __name__ == "__main__":
    run_test()

