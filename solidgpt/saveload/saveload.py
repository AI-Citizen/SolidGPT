from solidgpt.constants import *
from typing import Type
from solidgpt.diy.custom.customizeskillmanager import CustomizeSkillManager
from solidgpt.worknode.worknode import *
from solidgpt.imports import *


SKILL_NAME_TO_CONSTRUCTOR: dict[str, Type[WorkSkill]] = {
    SKILL_NAME_DEBUG_CODE: DebugCode,
    SKILL_NAME_WRITE_CODE: WriteCode,
    SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION: WritePRD,
    SKILL_NAME_USE_NOTION: UseNotion,
    SKILL_NAME_WRITE_HLD: WriteHLD,
    SKILL_NAME_CREATE_KANBAN_BOARD: CreateKanBan,
    SKILL_NAME_WRITE_YAML: WriteYAML,
    SKILL_NAME_WRITE_PageYAML: WritePageYAML,
}


AGENT_NAME_TO_CONSTRUCTOR: dict[str, Type[WorkAgent]] = {
    AGENT_NAME_SOFTWARE_DEVELOPER: AgentSoftwareDeveloper,
    AGENT_NAME_PRODUCT_MANAGER: AgentProductManager,
    AGENT_NAME_PRINCIPAL_ENGINEER: AgentPrincipalEngineer,
}


def generate_save_data_from_nodes(nodes: list[WorkNode], generate_debug_info: bool = False):
    save_data = []
    for node in nodes:
        node_data = {
            "node_id": node.node_id,
            "manual_review_result": node.manual_review_result
        }

        if generate_debug_info:
            node_data["next_node_ids"] = list(node.next_node_ids)
            node_data["output_id_dependencies"] = list(node.output_id_dependencies)

        agent = node.agent
        node_data["agent"] = agent.name
        if generate_debug_info:
            node_data["skills_available"] = agent.skills_available

        skill = agent.skill
        node_data["skill"] = skill.name
        node_data["inputs"] = []
        node_data["outputs"] = []

        for i in skill.inputs:
            temp_input = {
                # "param_type": str(i.param_type),
                "param_path": i.param_path,
                "loading_method": str(i.loading_method),
                "load_from_output_id": i.load_from_output_id,
            }
            if generate_debug_info:
                temp_input["param_name"] = i.param_name
                temp_input["param_category"] = str(i.param_category)
                temp_input["optional"] = str(i.optional)

            node_data["inputs"].append(temp_input)

        for o in skill.outputs:
            temp_output = {
                "id": o.id,
            }

            if generate_debug_info:
                temp_output["param_category"] = str(o.param_category)
                # temp_output["param_type"] = str(o.param_type)
                temp_output["id"] = o.id

            node_data["outputs"].append(temp_output)

        save_data.append(node_data)
    return save_data


def load_save_data_to_nodes(loaded_data):
    nodes: list[WorkNode] = []
    for node_data in loaded_data:
        agent_name = node_data["agent"]
        skill_name = node_data["skill"]
        inputs_data = node_data["inputs"]
        outputs_data = node_data["outputs"]
        skill_constructor = SKILL_NAME_TO_CONSTRUCTOR.get(skill_name, None)
        if skill_constructor is not None:
            skill: WorkSkill = skill_constructor()
            # if skill is None:
            #     skill = CustomizeSkillManager._instance.get_customzied_skill(skill_name)
            skill.init_config(inputs_data, outputs_data)
            agent = AGENT_NAME_TO_CONSTRUCTOR.get(agent_name)(skill)
            node = WorkNode(node_data["node_id"], agent, node_data["manual_review_result"])
            nodes.append(node)
    return nodes
