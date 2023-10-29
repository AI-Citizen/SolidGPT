import os
import glob
import openai
from solidgpt.definitions import LOCAL_STORAGE_OUTPUT_DIR, TEST_SKILL_WORKSPACE
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.util.util import save_to_json
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skillio import SkillInputConfig, SkillInputLoadingMethod
from solidgpt.src.workskill.skills.analysis import ProductAnalysis
from solidgpt.src.workskill.skills.load_repo import LoadRepo
from solidgpt.src.workskill.skills.query_code_local import QueryCodeLocal
from solidgpt.src.workskill.skills.repo_chat import RepoChat
from solidgpt.src.workskill.skills.summarize_file import SummaryFile
from solidgpt.src.workskill.skills.summary_file_local import SummaryFileLocal
from solidgpt.src.workskill.skills.summary_project import SummaryProject
from solidgpt.src.workskill.skills.techsolution import ProvideTechSolution
from solidgpt.src.workskill.skills.write_prd import WritePRD
from solidgpt.src.workskill.skills.autogen_analysis import AutoGenAnalysis
from solidgpt.src.workskill.workskill import WorkSkill


def generate_node(node_id: str, skill: WorkSkill, input_configs: list[SkillInputConfig], output_ids: list[int], manual_review_result: bool = False):
    skill.init_config(
        [
            config.to_dict() for config in input_configs
        ],
        [
            {"id": output_id} for output_id in output_ids
        ])
    node: WorkNode = WorkNode(node_id, skill, manual_review_result)
    return node

def generate_node_with_output_configs(node_id: str, skill: WorkSkill, input_configs: list[SkillInputConfig], output_configs: list, manual_review_result: bool = False):
    skill.init_config(
        [
            config.to_dict() for config in input_configs
        ],
        [
            config_dict for config_dict in output_configs
        ])
    node: WorkNode = WorkNode(node_id, skill, manual_review_result)
    return node

def build_onboarding_graph(repo_path: str, onborading_graph_id: str, upload_id: str, enable_summary_code: bool = False):
    graph = WorkGraph(output_id=onborading_graph_id)
    # input_ids = [-1] means the input is from the user
    load_repo = generate_node("0", LoadRepo(), [SkillInputConfig(os.path.join(repo_path, upload_id),
                                                                 SkillInputLoadingMethod.LOAD_FROM_STRING, -1)], [0])
    summary_project = generate_node_with_output_configs("1", SummaryProject(),
                                                        [
                                                            SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID, 0)
                                                        ],
                                                        [
                                                            {"id": 1},
                                                            {"id": 2, "to_display": True}
                                                        ])
    graph.add_node(load_repo)
    graph.add_node(summary_project)
    if enable_summary_code:
        summary_code = generate_node("2", SummaryFileLocal(), [SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, onborading_graph_id), 
                                                          SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID, 0)], [3, 4])
        graph.add_node(summary_code)
    return graph

def build_prd_graph(requirement: str, project_additional_info: str, onborading_graph_id: str):
    graph = WorkGraph(output_id=onborading_graph_id)
    onboarding_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, onborading_graph_id)
    code_summary_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Summary_*"))[0]

    analysis_product = generate_node("0", ProductAnalysis(), 
                                     [
                                         SkillInputConfig(code_summary_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                         SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, project_additional_info),
                                         SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                      ], output_ids= [0])
    write_prd = generate_node("1", WritePRD(), [SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID, 0)], output_ids=[1])
    graph.add_node(analysis_product)
    graph.add_node(write_prd)
    return graph

def build_prd_graph_with_stage(requirement: str, project_additional_info: str, onboarding_graph_id: str, stage: int,
                               edit_content: str, output_id: str):
    graph = WorkGraph(output_id=output_id)
    onboarding_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, onboarding_graph_id)
    code_summary_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Summary_*"))[0]
    if stage == 0:
        analysis_product = generate_node_with_output_configs("0", ProductAnalysis(),
                                         [
                                             SkillInputConfig(code_summary_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                             SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, project_additional_info),
                                             SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                          ],
                                         [
                                             {"id": 0, "to_display": True}
                                         ])
        graph.add_node(analysis_product)
        return graph
    elif stage == 1:
        write_prd = generate_node_with_output_configs("1", WritePRD(),
                                  [
                                      SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, edit_content)
                                  ],
                                  [
                                      {"id": 1, "to_display": True}
                                  ])
        graph.add_node(write_prd)
        return graph
    return None

def build_tech_solution_graph(requirement: str, onboarding_graph_id: str, output_id: str):
    graph = WorkGraph(output_id=output_id)
    onboarding_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, onboarding_graph_id)
    code_shema_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Schema_*"))[0]
    code_summary_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Summary_*"))[0]
    query_code = generate_node("0", QueryCodeLocal(),
                                 [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, onboarding_graph_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                 ], output_ids=[0])
    tech_solution = generate_node_with_output_configs("1", ProvideTechSolution(),
                                                      [
                                                          SkillInputConfig(code_shema_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig(code_summary_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement)
                                                      ],
                                                      [
                                                          {"id": 1, "to_display": True}
                                                      ])
    
    graph.add_node(query_code)
    graph.add_node(tech_solution)
    return graph

def build_repo_chat_graph(requirement: str, onboarding_graph_id: str, output_id: str):
    graph = WorkGraph(output_id=output_id)
    onboarding_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, onboarding_graph_id)
    code_shema_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Schema_*"))[0]
    code_summary_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Summary_*"))[0]
    history_context_path = os.path.join(onboarding_folder_path, f'{onboarding_graph_id}_repochat.json')
    # Create history context json file if not exist
    # Define the path to the JSON file
    history_context_path = os.path.join(onboarding_folder_path, f'{onboarding_graph_id}_repochat.json')

    # Check if the file already exists
    if not os.path.exists(history_context_path):
        # Create a default JSON data structure if the file doesn't exist
        default_data = {"HistoryContent": []}
        save_to_json(default_data, history_context_path)
    
    query_code = generate_node("0", QueryCodeLocal(),
                                 [
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, onboarding_graph_id),
                                    SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                 ], output_ids=[0])
    tech_solution = generate_node_with_output_configs("1", RepoChat(),
                                                      [
                                                          SkillInputConfig(code_shema_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig(code_summary_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                          SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                                          SkillInputConfig(history_context_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                                      ],
                                                      [
                                                          {"id": 1, "to_display": True}
                                                      ])
    
    graph.add_node(query_code)
    graph.add_node(tech_solution)
    return graph


def build_autogen_analysis_graph(requirement: str, onboarding_graph_id: str, output_id: str,
                                 autogen_message_input_callback, autogen_update_result_callback):
    graph = WorkGraph(output_id=output_id)
    onboarding_folder_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, onboarding_graph_id)
    code_shema_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Schema_*"))[0]
    code_summary_path = glob.glob(os.path.join(onboarding_folder_path, 'Summary_project_*', "Code_Summary_*"))[0]

    query_code = generate_node("0", QueryCodeLocal(),
                               [
                                   SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1,
                                                    onboarding_graph_id),
                                   SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1,
                                                    requirement),
                               ], output_ids=[0])
    autogen_solution = generate_node_with_output_configs("1", AutoGenAnalysis(),
                                                      [
                                                          SkillInputConfig(code_shema_path,
                                                                           SkillInputLoadingMethod.LOAD_FROM_STRING,
                                                                           -1),
                                                          SkillInputConfig(code_summary_path,
                                                                           SkillInputLoadingMethod.LOAD_FROM_STRING,
                                                                           -1),
                                                          SkillInputConfig("",
                                                                           SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING,
                                                                           -1, requirement),
                                                      ],
                                                      [])
    graph.add_node(query_code)
    graph.add_node(autogen_solution)
    graph.custom_data["autogen_message_input_callback"] = autogen_message_input_callback
    graph.custom_data["autogen_update_result_callback"] = autogen_update_result_callback
    return graph
