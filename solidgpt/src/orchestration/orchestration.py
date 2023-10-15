import uuid
from solidgpt.src.workgraph.graph import build_onboarding_graph
from solidgpt.src.workgraph.graph_helper import GraphStatus, GraphType
from solidgpt.src.manager.initializer import Initializer
from solidgpt.src.workgraph.workgraph import *


class GraphInfo:
    __graph: WorkGraph = None
    __graph_name: str = ""
    graph_id: str
    graph_type: GraphType
    graph_status: GraphStatus

    def __init__(self, graph_name):
        self.__graph = WorkGraph()
        self.__graph_name = graph_name

    def __init__(self, init_graph: WorkGraph, init_graph_id: str, graph_type: GraphType = None, graph_status: GraphStatus = None):
        self.__graph = init_graph
        self.graph_type = graph_type
        self.graph_status = graph_status
        self.graph_id = init_graph_id

    def get_graph(self):
        return self.__graph

    def get_name(self):
        return self.__graph_name


class Orchestration:
    _instance = None
    __graphs: list[GraphInfo] = []

    # Using a dict to monitor the status of each graph, always update the status of the graph in the dict
    # When the graph is completed and expired (e.g. 1 hour), remove the graph from the dict
    graph_monitor: dict[str, GraphInfo] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Orchestration, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance

    def __init__(self):
        Initializer()
        self.__graphs = []

    def add_graph(self, json_file_path: str, graph_name: str):
        if not os.path.isfile(json_file_path):
            print("Cannot add graph, the specified json file path does not contain a file.", file=sys.stderr)
            return
        if not json_file_path.endswith(".json"):
            print("Cannot add graph, the specified file is not a json file.", file=sys.stderr)
            return

        temp_graph = GraphInfo(graph_name)
        temp_graph.get_graph().load_data(json_file_path)
        # try:
        #     temp_graph.get_graph().load_data(json_file_path)
        # except:
        #     print("Cannot add graph, loading json file into graph failed.", file=sys.stderr)
        #     return

        self.__graphs.append(temp_graph)
        return
    
    def add_graph(self, init_graph: WorkGraph, init_graph_id: str, graph_type: GraphType):
        graph_info = GraphInfo(init_graph, init_graph_id, graph_type=graph_type, graph_status=GraphStatus.NotStarted)
        self.graph_monitor[init_graph_id] = graph_info
        return init_graph_id

    def get_graph_status(self, graph_id: str) -> GraphStatus:
        if graph_id not in self.graph_monitor:
            return GraphStatus.NotStarted
        return self.graph_monitor.get(graph_id).graph_status
    
    def run_graph_with_id(self, graph_id: str):
        if graph_id not in self.graph_monitor:
            logging.error("Cannot run graph, invalid graph id.")
            return
        self.graph_monitor[graph_id].graph_status = GraphStatus.Running
        graph = self.graph_monitor[graph_id].get_graph()
        graph.init_node_dependencies()
        graph.execute()
        self.graph_monitor[graph_id].graph_status = GraphStatus.Completed
        return

    def run_graph_with_index(self, graph_index: int):
        if 0 < graph_index < len(self.__graphs):
            print("Cannot run graph, index out of range.", file=sys.stderr)
            return
        self.__graphs[graph_index].get_graph().execute()

    def run_graph_with_name(self, graph_name: str):
        idx = self.get_graph_index(graph_name)
        if idx < 0:
            print_error_message("Cannot run graph, invalid graph name.")
            return
        return self.run_graph_with_index(idx)

    def get_graph_index(self, graph_name: str):
        for graph in self.__graphs:
            if graph.get_name() == graph_name:
                return self.__graphs.index(graph)
        return -1

    def remove_graph(self, graph_index: int):
        if 0 <= graph_index < len(self.__graphs):
            print("Cannot remove graph, index out of range.", file=sys.stderr)
            return
        self.__graphs.pop(graph_index)

    def remove_all_graphs(self):
        self.__graphs.clear()

    def show_graphs(self):
        graph_str = "Graphs: \n"
        idx = 0
        for graph in self.__graphs:
            graph_str += str(idx) + ": " + graph.get_name() + "\n"
            idx += 1
        print(graph_str)


# Running sample
if __name__ == "__main__":
    orchestration = Orchestration()
    # onborading API call will trigger the following code
    graph = build_onboarding_graph(os.path.join(TEST_SKILL_WORKSPACE, "in", "repo"), True)
    graph_id = orchestration.add_graph(graph, GraphType.OnboardingGraph)
    orchestration.run_graph_with_id(graph_id)
