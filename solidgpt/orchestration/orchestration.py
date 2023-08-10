"""everything in orchestration can be considered as global"""
# from solidgpt.worknode.worknode import *
from solidgpt.saveload.saveload import *
from solidgpt.imports import *


class Orchestration:

    nodes: list[WorkNode] = []
    node_map: dict[int, WorkNode] = {}

    def __init__(self):
        return

    def init_node_dependencies(self):
        for node in self.nodes:
            node.orchestration = self
            self.node_map[node.node_id] = node

        for node in self.nodes:
            if node.next_node_id >= 0:
                self.node_map[node.next_node_id].dependencies.append(node.node_id)
        return

    def execute(self):
        print("Executing SolidGPT...")
        for node in self.nodes:
            node.execute()

    def create_default_scenario(self):

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
        code_node.next_node_id = debug_node.node_id

        self.nodes.append(debug_node)
        self.nodes.append(code_node)
        self.init_node_dependencies()

    def generate_save_data(self):
        save_data = generate_save_data_from_nodes(self.nodes)
        save_to_json(save_data)
        return
