import logging
import os
import glob
import openai
from solidgpt.definitions import LOCAL_STORAGE_OUTPUT_DIR
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.util.util import save_to_json
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skillio import SkillInputConfig, SkillInputLoadingMethod
from solidgpt.src.workskill.skills.code_chat import CodeChat
from solidgpt.src.workskill.skills.create_codeplan_v4 import CreateCodePlanV4
from solidgpt.src.workskill.skills.create_codesolution_v3 import CreateCodeSolutionV3
from solidgpt.src.workskill.skills.http_codesolution import HTTPCodeSolution
from solidgpt.src.workskill.skills.notion_chat import NotionChat
from solidgpt.src.workskill.skills.select_template import SelectTemplate
from solidgpt.src.workskill.skills.vscode_embed_v2 import VscodeEmbedV2
from solidgpt.src.workskill.skills.notion_embed import NotionEmbed
from solidgpt.src.workskill.skills.repo_chat_v2 import RepoChatV2
from solidgpt.src.workskill.workskill import WorkSkill

def generate_node(node_id: str, skill: WorkSkill, input_configs: list[SkillInputConfig], output_ids: list[int], manual_review_result: bool = False, graph_cache: dict = {}):
    skill.init_config(
        [
            config.to_dict() for config in input_configs
        ],
        [
            {"id": output_id} for output_id in output_ids
        ])
    node: WorkNode = WorkNode(node_id, skill, manual_review_result, graph_cache)
    return node


def generate_node_with_output_configs(node_id: str, skill: WorkSkill, input_configs: list[SkillInputConfig], output_configs: list, manual_review_result: bool = False,  graph_cache: dict = {}):
    skill.init_config(
        [
            config.to_dict() for config in input_configs
        ],
        [
            config_dict for config_dict in output_configs
        ])
    node: WorkNode = WorkNode(node_id, skill, manual_review_result, graph_cache)
    return node

def build_repo_chat_graph_v2(message: str, session_id: str):
    graph = WorkGraph(output_id=session_id)
    session_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id)
    code_plan_path = glob.glob(os.path.join(session_folder_path,  "Code_Plan_*"))[0]
    relatived_code_files_path = glob.glob(os.path.join(session_folder_path,  "Relatived_Code_File_*"))[0]
    # Create history context json file if not exist
    # Define the path to the JSON file
    history_context_path = os.path.join(session_folder_path, f'{session_id}_repochat.json')

    # Check if the file already exists
    if not os.path.exists(history_context_path):
        # Create a default JSON data structure if the file doesn't exist
        default_data = {"HistoryContent": []}
        save_to_json(default_data, history_context_path)

    tech_solution = generate_node_with_output_configs("1", RepoChatV2(),
                                                      [
                                                          SkillInputConfig(code_plan_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, message),
                                                          SkillInputConfig(history_context_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig(relatived_code_files_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                      ],
                                                      [
                                                          {"id": 1, "to_display": True}
                                                      ])

    graph.add_node(tech_solution)
    return graph

def build_code_plan_graph_v4(requirement : str, session_id : str):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    summary_path = glob.glob(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id, "RelatedCodeFiles*"))[0]
    create_code_plan = generate_node_with_output_configs("0", CreateCodePlanV4(),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_STRING, -1, summary_path),
                                ], output_configs=[{"id": 0, "to_display": True}], graph_cache=graph_cache)
    graph.add_node(create_code_plan)
    return graph

def build_code_solution_graph_v3(requirement : str, session_id : str, code_plan : str):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    related_code_files_path = glob.glob(os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id,  "ProjectSummary"))[0]
    create_code_solution = generate_node_with_output_configs("1", CreateCodeSolutionV3(),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, code_plan),
                                    SkillInputConfig(related_code_files_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1)
                                ], output_configs=[{"id": 1, "to_display": True}], graph_cache=graph_cache)
    graph.add_node(create_code_solution)
    return graph


def build_onboarding_graph_v4(session_id : str, base_path : str):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    logging.info(f"base path: {base_path}")
    vscode_embed = generate_node_with_output_configs("0", VscodeEmbedV2(),
                                 [
                                     SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                     SkillInputConfig(base_path,
                                                      SkillInputLoadingMethod.LOAD_FROM_STRING,
                                                      -1),
                                 ],
                                output_configs=[{"id": 0, "to_display": True}, {"id": 1, "to_display": True}])
    graph.add_node(vscode_embed)
    return graph


def build_select_template_graph(requirement: str,session_id : str):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    select_template = generate_node_with_output_configs("0", SelectTemplate(),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                ], output_configs=[{"id": 0, "to_display": True}], graph_cache=graph_cache)
    graph.add_node(select_template)
    return graph


def build_http_solution_graph(requirement: str,session_id : str):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    http_solution = generate_node_with_output_configs("0", HTTPCodeSolution(),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                ], output_configs=[{"id": 1, "to_display": True}])
    graph.add_node(http_solution)
    return graph


def build_notion_graph(onboarding_id : str, workspace_token: str, page_id : str):
    graph = WorkGraph(output_id=onboarding_id)
    notion_embed = generate_node_with_output_configs("0", NotionEmbed(),
                                 [
                                     SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, onboarding_id),
                                     SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, page_id),
                                     SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, workspace_token),
                                 ],
                                output_configs=[{"id": 0, "to_display": True}])
    graph.add_node(notion_embed)
    return graph

  
def build_code_chat_graph(requirement: str, session_id: str, scope: list[str]):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    session_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id)
    history_context_path = os.path.join(session_folder_path, f'{session_id}_chat.json')

    # Check if the file already exists
    if not os.path.exists(history_context_path):
        # Create a default JSON data structure if the file doesn't exist
        default_data = {"HistoryContent": []}
        save_to_json(default_data, history_context_path)

    chat_response = generate_node_with_output_configs("0", CodeChat(scope),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                    SkillInputConfig(history_context_path, SkillInputLoadingMethod.LOAD_FROM_STRING,
                                                     -1),
                                ], output_configs=[{"id": 1, "to_display": True}])
    graph.add_node(chat_response)
    return graph


def build_notion_chat_graph(requirement: str, session_id: str, scope: list[str]):
    graph = WorkGraph(output_id=session_id)
    graph_cache = {}
    graph_cache["session_id"] = session_id
    session_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id)
    history_context_path = os.path.join(session_folder_path, f'{session_id}_chat.json')

    # Check if the file already exists
    if not os.path.exists(history_context_path):
        # Create a default JSON data structure if the file doesn't exist
        default_data = {"HistoryContent": []}
        save_to_json(default_data, history_context_path)

    chat_response = generate_node_with_output_configs("0", NotionChat(scope),
                                [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, session_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                    SkillInputConfig(history_context_path, SkillInputLoadingMethod.LOAD_FROM_STRING,
                                                     -1),
                                ], output_configs=[{"id": 1, "to_display": True}])
    graph.add_node(chat_response)
    return graph



if __name__ == "__main__":
    pass
    # GPTManager()
    # # openai.api_key =
    # session_id = "standard-test"
    # # base_path = "/Users/daviddai/Documents/GitHub/SolidGPT-Private/solidgpt/src/workskill"
    # # graph = build_onboarding_graph_v4(session_id=session_id, base_path=base_path)
    # # graph.init_node_dependencies()
    # # graph.execute()
    #
    # requirement = "Can you create a new skill that can generate a html page given user requirement based on this file."
    # scope = ["/Users/daviddai/Documents/GitHub/SolidGPT-Private/solidgpt/src/workskill/skills/http_codesolution.py"]
    # graph = build_code_chat_graph(requirement=requirement, session_id=session_id, scope=scope)
    # # need a call back func in defined in celery task, cannot test here
    # graph.init_node_dependencies()
    # graph.execute()

