from solidgpt.manager.initializer import Initializer
from solidgpt.workgraph.workgraph import *


class GraphInfo:
    __graph: WorkGraph = None
    __graph_name: str = ""

    def __init__(self, graph_name):
        self.__graph = WorkGraph()
        self.__graph_name = graph_name

    def get_graph(self):
        return self.__graph

    def get_name(self):
        return self.__graph_name


class Orchestration:

    __graphs: list[GraphInfo] = []

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
