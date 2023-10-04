from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.orchestration.orchestration import *
from solidgpt.src.workgraph.graph import build_prd_graph, build_tech_solution_graph
import argparse

def run_tech_solution_graph(requirement: str,  code_path: str):
    GPTManager()
    graph = build_tech_solution_graph(requirement, code_path, os.path.dirname(os.path.abspath(__file__)))
    graph.init_node_dependencies()
    graph.execute()



def main():
    parser = argparse.ArgumentParser(description='Process solution information')
    parser.add_argument('-r', '--requirement', type=str, required=True, help='PRD requirement')
    parser.add_argument('-c', '--code_path', type=str, required=True, help='Path to code')
    args = parser.parse_args()
    run_tech_solution_graph(args.requirement, args.code_path)


if __name__ == "__main__":
    main()