"""everything in orchestration can be considered as global"""
from solidgpt.saveload.saveload import *
from solidgpt.imports import *
import os

# Path to the folder you want to create
output_folder_path = "out"


class Orchestration:

    nodes: list[WorkNode] = []
    node_map: dict[int, WorkNode] = {}
    output_map: dict[int, SkillOutput] = {}
    output_id_to_node_map: dict[int, WorkNode] = {}

    def __init__(self):
        # need to manually initialize here
        self.nodes = []
        self.node_map = {}
        self.output_map = {}
        self.output_id_to_node_map = {}
        if not os.path.exists(output_folder_path):
            # Create the output folder
            os.makedirs(output_folder_path)
            print(f"Folder '{output_folder_path}' created.")
        else:
            print(f"Folder '{output_folder_path}' already exists. You may want to delete it first.")
        return

    def add_node(self, node: WorkNode):
        self.nodes.append(node)

    def init_node_dependencies(self):

        # clear node map and output map
        self.node_map.clear()
        self.output_map.clear()
        self.output_id_to_node_map.clear()

        for node in self.nodes:
            # store this instance in node
            node.orchestration = self

            # add node to node map
            self.node_map[node.node_id] = node

            # create directory for node
            node_folder_path = output_folder_path + "/" + str(node.node_id)
            if not os.path.exists(node_folder_path):
                # Create the output folder
                os.makedirs(node_folder_path)
                print(f"Folder '{node_folder_path}' created.")
            else:
                print(f"Folder '{node_folder_path}' already exists. You may want to delete it first.")

            # add output to output map
            for o in node.agent.skill.outputs:
                # initialize output paths
                o.param_path = node_folder_path + "/" + (o.param_name + " " + str(o.id)).replace(" ", "_")
                # output can be consumed by inputs of other nodes
                if o.id >= 0:
                    self.output_map[o.id] = o
                    self.output_id_to_node_map[o.id] = node

        # second iteration after output map has been initialized
        for node in self.nodes:
            # add output dependencies for node
            for i in node.agent.skill.inputs:
                if i.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID:
                    if i.load_from_output_id == -1:
                        print("Error, " + i.param_name + ": cannot load from output id: -1.")
                        continue
                    node.output_id_dependencies.add(i.load_from_output_id)

                    # add current node to next_node_ids of the output node
                    if i.load_from_output_id not in self.output_map:
                        print("Error, input %s: loading from an invalid output id %d."
                              % (i.param_name, i.load_from_output_id))
                        continue
                    output_node = self.output_id_to_node_map[i.load_from_output_id]
                    if output_node.node_id == node.node_id:
                        print("Error, " + i.param_name + ": cannot load from its own output.")
                        continue
                    output_node.next_node_ids.add(node.node_id)
        return

    def execute(self):
        print("Initializing node dependencies...")
        self.init_node_dependencies()
        print("Executing SolidGPT...")
        for node in self.nodes:
            node.execute()

    """
    For testing purpose
    """
    def create_default_scenario(self, case: int):

        def create_default_debug_skill():
            debug_skill = DebugCode()
            return debug_skill

        def create_default_debug_agent():
            sde = AgentSoftwareDeveloper(create_default_debug_skill())
            return sde

        def create_default_debug_node():
            node = WorkNode(0, create_default_debug_agent())
            return node

        def create_default_code_skill():
            code_skill = WriteCode()
            return code_skill

        def create_default_code_agent():
            sde = AgentSoftwareDeveloper(create_default_code_skill())
            return sde

        def create_default_code_node():
            node = WorkNode(1, create_default_code_agent())
            return node

        debug_node = create_default_debug_node()
        code_node = create_default_code_node()
        self.nodes.clear()
        if case == 0:
            pass
        elif case == 1:
            debug_node.agent.skill.init_config(
                [
                    {
                        "param_name": "Source Code",
                        "param_type": "SkillIOParamType.StringContent",
                        "param_content": "",
                        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
                        "load_from_output_id": 0
                    },
                    {
                        "param_name": "Error Message",
                        "param_type": "SkillIOParamType.StringContent",
                        "param_content": "",
                        "loading_method": "SkillInputLoadingMethod.LOAD_MANUALLY_FROM_STRING",
                        "load_from_output_id": -1
                    }
                ],
                [
                    {
                        "id": 1
                    }
                ]
            )
            code_node.agent.skill.init_config(
                [
                    {
                        "param_name": "Design Doc",
                        "param_type": "SkillIOParamType.StringContent",
                        "param_content": "",
                        "loading_method": "SkillInputLoadingMethod.LOAD_MANUALLY_FROM_STRING",
                        "load_from_output_id": -1
                    }
                ],
                [
                    {
                        "id": 0
                    }
                ]
            )

        # case ends
        self.nodes.append(debug_node)
        self.nodes.append(code_node)
        self.init_node_dependencies()
        return

    def save_data(self, filename: str = "data.json", generate_debug_info: bool = False):
        save_data = generate_save_data_from_nodes(self.nodes, generate_debug_info)
        save_to_json(save_data, filename)
        return

    def load_data(self, filename: str = "data.json"):
        loaded_data = load_from_json(filename)
        self.nodes.clear()
        self.nodes = load_save_data_to_nodes(loaded_data)
        self.init_node_dependencies()
        return

    def get_input_path(self, skill_input: SkillInput):
        if skill_input.loading_method == SkillInputLoadingMethod.LOAD_FROM_STRING:
            return skill_input.param_path
        elif skill_input.loading_method == SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID:
            return self.output_map[skill_input.load_from_output_id].param_path
        return ""
