from solidgpt.src.orchestration.orchestration import *

class QuickStartGraphCategory(Enum):
    System = "system dev graph"
    App = "webapp dev graph"

def generate_node_prd(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False, input_path = None):
    # write prd skill
    skill: WorkSkill = WritePRD()
    skill.init_config(
        [
            {
                "param_path": input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentProductManager(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node


def generate_node_hld(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False):
    # write hld skill
    skill: WorkSkill = WriteHLD()
    skill.init_config(
        [
            {
                "param_path": "",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentPrincipalEngineer(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node

def generate_node_custom_system_design(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False):
    # write hld skill
    skill: WorkSkill = CustomizeSkillManager._instance.get_customzied_skill("WrteSystemDesign")
    skill.init_config(
        [
            {
                "param_path": "",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentPrincipalEngineer(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node

def generate_node_kanban(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False):
    # write hld skill
    skill: WorkSkill = CreateKanBan()
    skill.init_config(
        [
            {
                "param_path": "",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentPrincipalEngineer(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node

def generate_node_page(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False):
    # generate page skill
    skill: WorkSkill = WriteYAML()
    skill.init_config(
        [
            {
                "param_path": "",
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentSoftwareDeveloper(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node

def generate_node_run_app(node_id: str, input_ids: list[int], output_ids: list[int], manual_review_result: bool = False):
    skill: WorkSkill = RunApp()
    skill.init_config(
        [
            {
                "param_path": os.path.join(LOCAL_STORAGE_OUTPUT_DIR , f"{input_ids[0]}/Write_YAML_Result_3"),  # Manually input the generate node page output path
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": input_ids[0]
            },
        ],
        [
            {
                "id": output_ids[0]
            }
        ])
    agent: WorkAgent = AgentSoftwareDeveloper(skill)
    node: WorkNode = WorkNode(node_id, agent, manual_review_result)
    return node

def run_system_dev_graph():
    Initializer()
    app = WorkGraph()
    # input_ids = [-1] means the input is from the user
    app.add_node(generate_node_prd("0", input_ids=[-1], 
                                   input_path=os.path.join(LOCAL_STORAGE_DIR, "workspace", "in", "AIProductBasicInfo.json"), 
                                   output_ids=[0], 
                                   manual_review_result=True))
    app.add_node(generate_node_custom_system_design("1", input_ids=[0], output_ids=[1], manual_review_result=True))
    app.add_node(generate_node_kanban("2", input_ids=[1], output_ids=[2], manual_review_result=True))
    app.init_node_dependencies()
    app.save_data(os.path.join(LOCAL_STORAGE_DIR, "workspace", "config", "system_config_data.json"))

def run_webapp_dev_graph():
    Initializer()
    app = WorkGraph()
     # input_ids = [-1] means the input is from the user
    app.add_node(generate_node_prd("0", input_ids=[-1], 
                                   input_path=os.path.join(LOCAL_STORAGE_DIR, "workspace", "in", "WebsiteBasicInfo.json"), 
                                   output_ids=[0], 
                                   manual_review_result=True))
    app.add_node(generate_node_hld("1", input_ids=[0], output_ids=[1]))
    app.add_node(generate_node_kanban("2", input_ids=[1], output_ids=[2], manual_review_result=True))
    app.add_node(generate_node_page("3", input_ids=[2], output_ids=[3]))
    app.add_node(generate_node_run_app("4", input_ids=[3], output_ids=[4]))
    app.init_node_dependencies()
    app.save_data(os.path.join(LOCAL_STORAGE_DIR, "workspace", "config", "webapp_config_data.json"))

if __name__ == "__main__":
    run_system_dev_graph()
    run_webapp_dev_graph()