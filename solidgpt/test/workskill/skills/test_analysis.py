from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import *
from solidgpt.src.workskill.skills.analysis import ProductAnalysis


TEST_SKILL_WORKSPACE = os.path.join(TEST_DIR, "workskill", "skills", "workspace")

def run_test():
    Initializer()
    app = WorkGraph()
    skill: WorkSkill = ProductAnalysis()
    requirement_input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "ProductRequirements.txt")
    schema_input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "RepoSchema.txt")
    introduction_input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "ProductIntroduction.txt")
    skill.init_config(
        [
            {
                "param_path": introduction_input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
            {
                "param_path": schema_input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
            {
                "param_path": requirement_input_path,
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
    # app.save_data(os.path.join(TEST_SKILL_WORKSPACE, "config", "config_data.json"))
    app.execute()

if __name__ == "__main__":
    run_test()

