from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.orchestration.orchestration import *
from solidgpt.src.workgraph.graph import build_prd_graph, build_tech_solution_graph
import argparse

def run_prd_graph(requirement: str, project_additional_info: str, background_info_path: str):
    GPTManager()
    graph = build_prd_graph(requirement, project_additional_info, background_info_path, os.path.dirname(os.path.abspath(__file__)))
    graph.init_node_dependencies()
    graph.execute()

def main():
    parser = argparse.ArgumentParser(description='Process PRD information')
    parser.add_argument('-r', '--requirement', type=str, required=True, help='PRD requirement')
    parser.add_argument('-b', '--background_info_path', type=str, default='', help='Path to project background info')
    parser.add_argument('-a', '--project_additional_info', type=str, default='', help='Additional project info')
    args = parser.parse_args()
    run_prd_graph(args.requirement, args.project_additional_info, args.background_info_path)


if __name__ == "__main__":
    main()