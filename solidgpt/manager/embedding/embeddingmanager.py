
import logging
from solidgpt.manager.embedding.embeddingmodel import LOCAL_EMBEDDING_STORAGE_DIVIDED_RESOURCE_DIR, LOCAL_EMBEDDING_STORAGE_EMBEDDED_RESOURCE_DIR, LOCAL_EMBEDDING_STORAGE_ORIGINAL_RESOURCE_DIR, EmbeddingModel, EmbeddingModelParameter


DEFAULT_EMBEDDING_MODEL_LABEL = 'DefaultEmbeddingModel'
DEFAULT_EMBEDDING_RESOURCE_NAME = 'Default'

class EmbeddingManager:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingManager, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance
    
    def __init__(self, embed_resources = False, is_default_resources_path = True):
        self.embed_models_container = dict(str, EmbeddingModel)
        self.embed_resources = embed_resources
        if is_default_resources_path:
            self.__add_default_embed_model()

    def __add_default_embed_model(self):
        default_param = EmbeddingModelParameter(resource_name=DEFAULT_EMBEDDING_RESOURCE_NAME, 
                                                    original_resources_folder_path=LOCAL_EMBEDDING_STORAGE_ORIGINAL_RESOURCE_DIR,
                                                    divided_resources_folder_path=LOCAL_EMBEDDING_STORAGE_DIVIDED_RESOURCE_DIR,
                                                    embedded_resources_folder_path=LOCAL_EMBEDDING_STORAGE_EMBEDDED_RESOURCE_DIR)
        self.add_embed_model(DEFAULT_EMBEDDING_MODEL_LABEL, default_param)

    def add_embed_model(self, label : str, param : EmbeddingModelParameter):
        self.embed_models_container[label] = EmbeddingModel(param)

    def query_from_embed_model(self, query_message : str, model_label = DEFAULT_EMBEDDING_MODEL_LABEL, response_num = 12) -> list(str):
        if self.embed_models_container.get(model_label) is None:
            logging.error(f"Embedding model {model_label} not found.")
            return
        return self.embed_models_container[model_label].query_most_match_result_from_resource(query_message, response_num)