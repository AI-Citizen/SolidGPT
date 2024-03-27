from typing import Type
from solidgpt.src.diy.custom.customizeskillmanager import CustomizeSkillManager
from solidgpt.src.worknode.worknode import *
from solidgpt.src.imports import *
from solidgpt.src.constants import *


SKILL_NAME_TO_CONSTRUCTOR: dict[str, Type[WorkSkill]] = {
    SKILL_NAME_CREATE_KANBAN_BOARD: CreateKanBan,
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

        skill = node.skill
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
        skill_name = node_data["skill"]
        inputs_data = node_data["inputs"]
        outputs_data = node_data["outputs"]
        skill_constructor = SKILL_NAME_TO_CONSTRUCTOR.get(skill_name, None)
        if skill_constructor is not None:
            skill: WorkSkill = skill_constructor()
        else:
            skill = CustomizeSkillManager._instance.get_customzied_skill(skill_name)
        if skill is not None:
            skill.init_config(inputs_data, outputs_data)
            node = WorkNode(node_data["node_id"], skill, node_data["manual_review_result"])
            nodes.append(node)
    return nodes

