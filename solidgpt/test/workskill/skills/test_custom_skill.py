from solidgpt.src.diy.custom.customizeskillmanager import CustomizeSkillManager
from solidgpt.src.manager.embedding.embeddingmanager import EmbeddingManager
from solidgpt.src.manager.embedding.embeddingmodel import EmbeddingModelParameter
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.workgraph.workgraph import *


TEST_SKILL_WORKSPACE = os.path.join(TEST_DIR, "workskill", "skills", "workspace")



def run_test():
    GPTManager()
    embedding_manager = EmbeddingManager()
    embedding_manager.add_embed_model("TestEmbedding", EmbeddingModelParameter(
        resource_name= "TestEmbedding",
        original_resources_folder_path= os.path.join(TEST_SKILL_WORKSPACE, "embedding", "original"),
        divided_resources_folder_path= os.path.join(TEST_SKILL_WORKSPACE, "embedding", "divided"),
        embedded_resources_folder_path= os.path.join(TEST_SKILL_WORKSPACE, "embedding", "embedded"),
        has_embedded=False
    ))
    CustomizeSkillManager(os.path.join(TEST_SKILL_WORKSPACE, 'custom_skill_definitions'))
    print(CustomizeSkillManager._instance.customized_skills_map.keys())
    app = WorkGraph()
    skill = CustomizeSkillManager._instance.get_customzied_skill("Brainstorming")
    input_path = os.path.join(TEST_SKILL_WORKSPACE, "in", "Brainstorming")
    skill.init_config(
        [
            {
                "param_path": input_path,
                "loading_method": "SkillInputLoadingMethod.LOAD_FROM_STRING",
                "load_from_output_id": -1
            },
        ],
        [
            {
                "id": 2
            } 
        ])
    node = WorkNode("2", skill)
    app.add_node(node)
    app.init_node_dependencies()
    app.execute()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_test()

