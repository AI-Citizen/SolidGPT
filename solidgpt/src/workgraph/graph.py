import os
import openai
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.skillio import SkillInputConfig, SkillInputLoadingMethod
from solidgpt.src.workskill.skills.analysis import ProductAnalysis
from solidgpt.src.workskill.skills.techsolution import ProvideTechSolution
from solidgpt.src.workskill.skills.write_prd import WritePRD
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

def build_prd_graph(requirement: str, project_additional_info: str, additional_info_path: str, output_path: str):
    graph = WorkGraph(output_directory_path_override=output_path)

    analysis_product = generate_node("0", ProductAnalysis(), 
                                     [
                                         SkillInputConfig(additional_info_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),
                                         SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, project_additional_info),
                                         SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                      ], output_ids= [0])
    write_prd = generate_node("1", WritePRD(), [SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID, 0)], output_ids=[1])
    graph.add_node(analysis_product)
    graph.add_node(write_prd)
    return graph

def build_tech_solution_graph(requirement: str,  code_path: str, output_path: str):
    graph = WorkGraph(output_directory_path_override=output_path)

    analysis_product = generate_node("0", ProvideTechSolution(), 
                                     [
                                         SkillInputConfig("", SkillInputLoadingMethod.LOAD_FROM_CACHE_STRING, -1, requirement),
                                         SkillInputConfig(code_path, SkillInputLoadingMethod.LOAD_FROM_STRING, -1),                                         
                                      ], output_ids= [0])
    graph.add_node(analysis_product)
    return graph
