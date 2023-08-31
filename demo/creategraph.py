from solidgpt.src.orchestration.orchestration import *


def generate_node_prd(node_id: int, input_ids: list[int], output_ids: list[int]):
    # write prd skill
    skill: WorkSkill = WritePRD()
    skill.init_config(
        [
            {
                "param_path": "workspace/in/ProductBasicInfo.json",
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_hld(node_id: int, input_ids: list[int], output_ids: list[int]):
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_kanban(node_id: int, input_ids: list[int], output_ids: list[int]):
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_main_page(node_id: int, input_ids: list[int], output_ids: list[int]):
    # write hld skill
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_sub_page(node_id: int, input_ids: list[int], output_ids: list[int]):
    # write hld skill
    skill: WorkSkill = WriteSubPage()
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_run_app(node_id: int, input_ids: list[int], output_ids: list[int]):
    # write hld skill
    skill: WorkSkill = RunApp()
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


app = WorkGraph()
app.add_node(generate_node_prd(0, [-1], [0]))
app.add_node(generate_node_hld(1, [0], [1]))
app.add_node(generate_node_kanban(2, [1], [2]))
app.add_node(generate_node_main_page(3, [2], [3]))
app.add_node(generate_node_sub_page(4, [2], [4]))
app.add_node(generate_node_run_app(5, [3], [5]))
app.init_node_dependencies()
app.save_data("workspace/config/config_data.json")
