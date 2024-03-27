from solidgpt.src.workgraph.displayresult import DisplayResult
from solidgpt.src.workskill.workskill import *
from solidgpt.src.util.util import *


class WorkNode:
    node_id: str = 0
    skill: WorkSkill = None
    next_node_ids: set[str] = []
    output_id_dependencies: set[int] = []
    manual_review_result: bool = False
    graph_cache: dict = {}
    display_result: DisplayResult = None

    def __init__(self, node_id: str, work_skill: WorkSkill, manual_review_result: bool = False, graph_cache : dict = {}):
        # Initialization
        self.node_id = node_id
        self.graph_cache = graph_cache
        work_skill.graph_cache = self.graph_cache
        self.skill = work_skill
        self.next_node_ids = set([])
        self.output_id_dependencies = set([])
        self.manual_review_result = manual_review_result
        self.display_result = DisplayResult()
        return

    def can_execute(self):
        if len(self.output_id_dependencies) == 0:
            return True
        print("still need to wait other nodes to finish first for node " + str(self.node_id))
        return False
