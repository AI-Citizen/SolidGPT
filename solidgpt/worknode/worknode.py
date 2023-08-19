import os.path
import time
from solidgpt.workagent.workagent import *
from solidgpt.util.util import *


class WorkNode:
    node_id: int = 0
    agent: WorkAgent = None
    next_node_ids: set[int] = []
    output_id_dependencies: set[int] = []
    orchestration = None
    manual_review_result: bool = False

    def __init__(self, node_id: int, work_agent: WorkAgent, manual_review_result: bool = False):
        # Initialization
        self.node_id = node_id
        self.agent = work_agent
        self.agent.node = self
        self.next_node_ids = set([])
        self.output_id_dependencies = set([])
        self.orchestration = None
        self.manual_review_result = manual_review_result
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
        # let user review result if needed
        if self.manual_review_result:
            time.sleep(0.25)
            print("\nPlease review result generated by %s agent's %s skill in node %s"
                  % (self.agent.name, self.agent.skill.name, str(self.node_id)))
            while True:
                user_input = input("Execution is halted. Please specify an action, then press Enter. "
                                   "To view all available actions, enter 'help':")

                if same_string(user_input, "help"):
                    help_msg: str = "{:<18}{}\n".format("help", "Show this help message.") + \
                                    "{:<18}{}\n".format("continue", "Continue execution.") + \
                                    "{:<18}{}\n".format("stop", "Stop program.") + \
                                    "{:<18}{}\n".format("path", "Show the path of this result.")
                    print(help_msg)
                    continue
                elif same_string(user_input, "continue"):
                    print("Continuing execution...")
                    break
                elif same_string(user_input, "stop"):
                    print("Exiting the program...")
                    exit(0)
                elif same_string(user_input, "path"):
                    print(os.path.abspath(os.path.dirname(self.agent.skill.outputs[0].param_path)))
                    continue
                else:
                    print("Invalid input entered.")
                    continue

        """inform dependent"""
        for next_node_id in self.next_node_ids:
            for o in self.agent.skill.outputs:
                self.orchestration.node_map[next_node_id].output_id_dependencies.remove(o.id)
            self.orchestration.node_map[next_node_id].execute()
