import json
from solidgpt.worknode.worknode import *


def save_to_json(data, filename="data.json"):
    # Save data to a JSON file
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=4)


def load_from_json(filename="data.json"):
    # Load data from a JSON file
    with open(filename, "r") as json_file:
        loaded_data = json.load(json_file)
    return loaded_data


def generate_save_data_from_nodes(nodes: list[WorkNode]):
    save_data = []
    for node in nodes:
        node_data = {"node_id": node.node_id, "next_node_id": node.next_node_id}
        node_data["dependencies"] = node.dependencies
        agent = node.agent
        agent_data = {"name": agent.name, "skills_available": agent.skills_available}

        skill = agent.skill
        skill_data = {"name": skill.name, "inputs": []}
        for i in skill.inputs:
            temp_input = {
                "param_name": i.param_name,
                "param_type": str(i.param_type),
                "param_content": i.param_content
            }
            skill_data["inputs"].append(temp_input)

        output_data = {
            "param_name": skill.output.param_name,
            "param_type": str(skill.output.param_type),
            "param_content": skill.output.param_content,
        }
        skill_data["output"] = output_data
        agent_data["skill"] = skill_data
        node_data["agent"] = agent_data
        save_data.append(node_data)
    return save_data


def load_save_data_to_nodes(loaded_data):
    for node_data in loaded_data:
        agent_data = node_data["agent"]
        skill_data = node_data["skill"]
    save_data = []
    # todo: finish loading
    # for node in nodes:
    #     node_data = {"node_id": node.node_id, "next_node_id": node.next_node_id}
    #
    #     agent = node.agent
    #     agent_data = {"name": agent.name, "skills_available": agent.skills_available}
    #
    #     skill = agent.skill
    #     skill_data = {"name": skill.name, "inputs": []}
    #     for i in skill.inputs:
    #         temp_input = {
    #             "param_name": i.param_name,
    #             "param_type": str(i.param_type),
    #             "param_content": i.param_content
    #         }
    #         skill_data["inputs"].append(temp_input)
    #
    #     output_data = {
    #         "param_name": skill.output.param_name,
    #         "param_type": str(skill.output.param_type),
    #         "param_content": skill.output.param_content,
    #     }
    #     skill_data["output"] = output_data
    #     agent_data["skill"] = skill_data
    #     node_data["agent"] = agent_data
    #     save_data.append(node_data)
    return save_data
