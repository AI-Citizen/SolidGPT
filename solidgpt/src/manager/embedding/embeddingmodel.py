import logging
import os
from typing import List
from numpy.linalg import norm
import numpy as np
import pandas as pd
import openai
from solidgpt.definitions import LOCAL_STORAGE_DIR
from solidgpt.src.configuration.configreader import ConfigReader

LOCAL_EMBEDDING_STORAGE_ORIGINAL_RESOURCE_DIR = os.path.join(LOCAL_STORAGE_DIR, "embedding", "originalresources")
LOCAL_EMBEDDING_STORAGE_DIVIDED_RESOURCE_DIR = os.path.join(LOCAL_STORAGE_DIR, "embedding", "dividedresources")
LOCAL_EMBEDDING_STORAGE_EMBEDDED_RESOURCE_DIR = os.path.join(LOCAL_STORAGE_DIR, "embedding", "embeddedresources")

class EmbeddingModelParameter:
    def __init__(self, resource_name: str, original_resources_folder_path: str, divided_resources_folder_path: str, embedded_resources_folder_path: str, has_embedded: bool = False):
        self.resource_name = resource_name
        self.original_resources_folder_path = original_resources_folder_path
        self.divided_resources_folder_path = divided_resources_folder_path
        self.embedded_resources_folder_path = embedded_resources_folder_path
        self.has_embedded = has_embedded

class EmbeddingModel:
    def __init__(self, param : EmbeddingModelParameter):
        # read api key from config file
        openai.api_key = ConfigReader().get_property("openai_api_key")
        self.EMBEDDINGS_MODEL = f"text-embedding-ada-002"
        self.resource_name = param.resource_name
        self.original_resources_folder_path = param.original_resources_folder_path
        self.divided_resources_folder_path = param.divided_resources_folder_path
        self.embedded_resources_folder_path = param.embedded_resources_folder_path
        self.has_embedded = param.has_embedded
    
    def embed_resources(self, split_word_num = 300):
        self.__split_resources_into_sections(split_word_num)
        self.__compute_save_resource_embedding()
        self.has_embedded = True

    def query_most_match_result_from_resource(self, message, candidate_num, resources_list = [], is_debug = False):
        if not self.has_embedded:
            logging.warning("Please embed resources first.")
            return
        query_embedding = self.__get_text_embedding(message)
        if len(resources_list) == 0:
            resources_list = os.listdir(self.embedded_resources_folder_path)
        resources_list = [item for item in resources_list if not self.__skip_placeholder_file(item)]
        ret = []
        try:
            candidate_num_for_each_resource = int(candidate_num / len(resources_list))
        except:
            logging.error("""Please embed the data first. 
            This issue often arises when the original resources aren't provided in the correct location.""")
        for resource_name in resources_list:
            embedded_background = pd.read_csv(
                os.path.join(self.embedded_resources_folder_path, resource_name, f"{self.resource_name}{resource_name}Embedding.csv"),
            )
            best_section = [(0, "")]
            for col_name in embedded_background.columns.tolist():
                embedded_background_section = embedded_background[col_name].values.tolist()
                cur_score = self.__vector_similarity(query_embedding, embedded_background_section)
                
                if cur_score > best_section[-1][0] and len(best_section) < candidate_num_for_each_resource:
                    best_section.append((cur_score, col_name))
                    best_section = sorted(best_section, reverse=True)
                elif cur_score > best_section[-1][0] and len(best_section) == candidate_num_for_each_resource:
                    best_section.pop()
                    best_section.append((cur_score, col_name))
                    best_section = sorted(best_section, reverse=True)
            for score, idx in best_section:
                if idx == "":
                    continue
                with open(os.path.join(self.divided_resources_folder_path, resource_name, f"{self.resource_name}Section{idx}.txt"), encoding="utf-8") as f:
                    lines = f.read()
                    ret.append((lines, score)) if is_debug else ret.append(lines)
        return ret
    
    def __get_embedding(self, text: str) -> List[float]:
        result = openai.Embedding.create(
        model=self.EMBEDDINGS_MODEL,
        input=text)
        return result["data"][0]["embedding"]

    def __get_text_embedding(self, text: str) -> List[float]:
        return self.__get_embedding(text)

    def __vector_similarity(self, x: List[float], y: List[float]) -> float:
        """
        We could use cosine similarity or dot product to calculate the similarity between vectors.
        In practice, we have found it makes little difference.
        """
        return np.dot(np.array(x), np.array(y)) / (norm(np.array(x)) * norm(np.array(y)))

    def __split_resources_into_sections(self, split_word_num):
        for file in os.listdir(self.original_resources_folder_path):
            if self.__skip_placeholder_file(file):
                continue
            file_name = file.split(".")[0]
            section_id = 0
            if not os.path.exists(os.path.join(self.divided_resources_folder_path, file_name)):
                os.mkdir(os.path.join(self.divided_resources_folder_path, file_name))
            with open(os.path.join(self.original_resources_folder_path, file), encoding="utf-8") as f:
                # TODO: Will support more language. Currently we only support the english text.
                lines = f.read().replace("\n", "").split(".")
                lines = list(filter(lambda x: True if x else False, lines))
                word_count = 0
                idx = 0
                last_idx = 0
                logging.info(file_name)
                while idx < len(lines):
                    while word_count < split_word_num:
                        if idx >= len(lines):
                            break
                        word_count += len(lines[idx])
                        idx += 1
                    with open(os.path.join(self.divided_resources_folder_path, file_name, f"{self.resource_name}Section{str(section_id).zfill(4)}.txt"), "w",
                            encoding='utf-8') as f2:
                        f2.write("。".join(lines[last_idx:idx]))
                    section_id += 1
                    last_idx = idx
                    word_count = 0


    def __compute_save_resource_embedding(self):
        ret_df = pd.DataFrame()
        for file_name in os.listdir(self.divided_resources_folder_path):
            if self.__skip_placeholder_file(file_name):
                continue
            ret_df = pd.DataFrame()
            for file in os.listdir(os.path.join(self.divided_resources_folder_path, file_name)):
                with open(os.path.join(self.divided_resources_folder_path, file_name, file), encoding="utf-8") as f:
                    lines = f.read()
                    section_id = file.split(".")[0][-4:]
                    print(file_name, section_id)
                    try:
                        ret_df[str(section_id).zfill(4)] = self.__get_text_embedding(lines)
                    except BaseException as ex:
                        print(f"{str(ex)}")
            if not os.path.exists(os.path.join(self.embedded_resources_folder_path, file_name)):
                os.mkdir(os.path.join(self.embedded_resources_folder_path, file_name))
            ret_df.to_csv(os.path.join(self.embedded_resources_folder_path, file_name, f"{self.resource_name}{file_name}Embedding.csv"), index=False)

    def __skip_placeholder_file(self, file:str) -> bool:
        return file == "Placeholder.md"


# Sample code
# param = EmbeddingModelParameter("test", LOCAL_EMBEDDING_STORAGE_ORIGINAL_RESOURCE_DIR, 
#                    LOCAL_EMBEDDING_STORAGE_DIVIDED_RESOURCE_DIR, 
#                    LOCAL_EMBEDDING_STORAGE_EMBEDDED_RESOURCE_DIR, True)
# embed = EmbeddingModel(param)
# embed.embed_resources()
# embed.query_most_match_result_from_resource("I want to know how to make a cake", 12)
