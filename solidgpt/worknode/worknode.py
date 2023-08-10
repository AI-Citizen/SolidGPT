from solidgpt.workagent.workagent import *


class WorkNode:
    node_id: int = 0
    agent: WorkAgent = None
    # todo: probably need to change to next_node_ids
    next_node_id: int = -1
    dependencies: list[int] = []
    orchestration = None

    def __init__(self, node_id: int, work_agent: WorkAgent, next_node_id: int = -1):
        # Initialization
        self.node_id = node_id
        self.agent = work_agent
        self.agent.node = self
        self.next_node_id = next_node_id
        self.dependencies = []
        self.orchestration = None
        return

    def can_execute(self):
        if len(self.dependencies) == 0:
            for i in self.agent.skill.inputs:
                if not i.is_loaded():
                    print("one input is not ready for node " + str(self.node_id))
                    """one input is not ready"""
                    return False
            print("all inputs are loaded for node " + str(self.node_id))
            """all inputs are loaded"""
            return True
        print("still need to wait other nodes to finish first for node " + str(self.node_id))
        """still need to wait other nodes to finish first"""
        return False

    def execute(self):
        if self.can_execute():
            print("Node " + str(self.node_id) + " executing...")
            self.agent.execute()

    def finish_execution(self):
        """inform dependent"""
        if self.next_node_id >= 0:
            self.orchestration.node_map[self.next_node_id].dependencies.remove(self.node_id)
            self.orchestration.node_map[self.next_node_id].execute()

        # todo: need to also check if current output are used by other nodes an input
