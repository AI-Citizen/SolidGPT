import json
from solidgpt.worknode.worknode import *
from solidgpt.imports import *


SKILL_NAME_TO_CONSTRUCTOR: dict = {
    SKILL_NAME_DEBUG_CODE: DebugCode,
    SKILL_NAME_WRITE_CODE: WriteCode,
}


AGENT_NAME_TO_CONSTRUCTOR: dict = {
    AGENT_NAME_SOFTWARE_DEVELOPER: AgentSoftwareDeveloper,
}


def save_to_json(data, filename="data.json"):
    # Save data to a JSON file
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=4)


def load_from_json(filename="data.json"):
    # Load data from a JSON file
    with open(filename, "r") as json_file:
        loaded_data = json.load(json_file)
    return loaded_data


def generate_save_data_from_nodes(nodes: list[WorkNode], generate_debug_info: bool = False):
    save_data = []
    for node in nodes:
        node_data = {
            "node_id": node.node_id,
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
                "param_name": i.param_name,
                "param_type": str(i.param_type),
                "param_content": i.param_content,
                "loading_method": str(i.loading_method),
                "load_from_output_id": i.load_from_output_id,
            }
            if generate_debug_info:
                temp_input["param_category"] = str(i.param_category)
                temp_input["optional"] = str(i.optional)

            node_data["inputs"].append(temp_input)

        for o in skill.outputs:
            temp_output = {
                "id": o.id,
            }

            if generate_debug_info:
                temp_output["param_category"] = str(o.param_category)
                temp_output["param_type"] = str(o.param_type)
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
        skill: WorkSkill = SKILL_NAME_TO_CONSTRUCTOR.get(skill_name)()
        skill.init_config(inputs_data, outputs_data)
        agent = AGENT_NAME_TO_CONSTRUCTOR.get(agent_name)(skill)
        node = WorkNode(node_data["node_id"], agent)
        nodes.append(node)
    return nodes
