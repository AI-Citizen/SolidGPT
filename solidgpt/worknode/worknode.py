from solidgpt.workagent.workagent import *
from solidgpt.util.util import *


class WorkNode:
    node_id: int = 0
    agent: WorkAgent = None
    next_node_ids: set[int] = []
    output_id_dependencies: set[int] = []
    manual_review_result: bool = False

    def __init__(self, node_id: int, work_agent: WorkAgent, manual_review_result: bool = False):
        # Initialization
        self.node_id = node_id
        self.agent = work_agent
        self.agent.node = self
        self.next_node_ids = set([])
        self.output_id_dependencies = set([])
        self.manual_review_result = manual_review_result
        return

    def can_execute(self):
        if len(self.output_id_dependencies) == 0:
            return True
        print("still need to wait other nodes to finish first for node " + str(self.node_id))
        return False
