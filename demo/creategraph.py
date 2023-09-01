from solidgpt.src.orchestration.orchestration import *


def generate_node_prd(node_id: int, input_ids: list[int], output_ids: list[int]):
    # write prd skill
    skill: WorkSkill = WritePRD()
    skill.init_config(
        [
            {
                "param_path": os.path.join(LOCAL_STORAGE_DIR, "demo_workspace", "in", "ProductBasicInfo.json"),
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
    # create kanban skill
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


def generate_node_page(node_id: int, input_ids: list[int], output_ids: list[int]):
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
    node: WorkNode = WorkNode(node_id, agent)
    return node


def generate_node_run_app(node_id: int, input_ids: list[int], output_ids: list[int]):
    # run app skill
    skill: WorkSkill = RunApp()
    skill.init_config(
        [
            {
                "param_path": os.path.join(ROOT_DIR , "..", "demo", "out/3/Write_YAML_Result_3"),  # Manually input the generate node page output path
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
    node: WorkNode = WorkNode(node_id, agent)
    return node

app = WorkGraph()
app.add_node(generate_node_prd(0, input_ids=[-1], output_ids=[0]))
app.add_node(generate_node_hld(1, input_ids=[0], output_ids=[1]))
app.add_node(generate_node_kanban(2, input_ids=[1], output_ids=[2]))
app.add_node(generate_node_page(3, input_ids=[2], output_ids=[3]))
app.add_node(generate_node_run_app(4, input_ids=[3], output_ids=[4]))
app.init_node_dependencies()
app.save_data(os.path.join(LOCAL_STORAGE_DIR, "demo_workspace", "config", "config_data.json"))
