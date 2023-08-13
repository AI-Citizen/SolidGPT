from solidgpt.workagent.workagent import *


class WorkNode:
    node_id: int = 0
    agent: WorkAgent = None
    next_node_ids: set[int] = []
    output_id_dependencies: set[int] = []
    orchestration = None

    def __init__(self, node_id: int, work_agent: WorkAgent):
        # Initialization
        self.node_id = node_id
        self.agent = work_agent
        self.agent.node = self
        self.next_node_ids = set([])
        self.output_id_dependencies = set([])
        self.orchestration = None
        return

    def can_execute(self):
        if len(self.output_id_dependencies) == 0:
            return True
        print("still need to wait other nodes to finish first for node " + str(self.node_id))
        return False

    def execute(self):
        if self.can_execute():
            print("Node " + str(self.node_id) + " executing...")
            self.agent.execute()

    def finish_execution(self):
        """inform dependent"""
        for next_node_id in self.next_node_ids:
            for o in self.agent.skill.outputs:
                self.orchestration.node_map[next_node_id].output_id_dependencies.remove(o.id)
            self.orchestration.node_map[next_node_id].execute()
