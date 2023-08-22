import os
import openai
import pandas as pd
import numpy as np
from numpy.linalg import norm
from solidgpt.configuration.configreader import ConfigReader


# from definitions import ROOT_DIR


class YAMLValidator:
    def __init__(self, yaml_str: str):
        self.yaml = yaml_str
        self.container_df = pd.read_csv(os.path.join("..", "embedding", "container_block_embedding.csv"))
        self.input_df = pd.read_csv(os.path.join("..", "embedding", "input_block_embedding.csv"))
        self.display_df = pd.read_csv(os.path.join("..", "embedding", "display_block_embedding.csv"))
        self.all_embedding_df = pd.concat([self.container_df, self.input_df, self.display_df], axis=1)
        openai.api_key = ConfigReader().get_property("openai_api_key")

    def validate(self) -> str:
        """
        Check and convert the GPT created yaml file string to valid lowdefy yaml file string
        :return: Converted valid lowdefy yaml file string
        """
        ret_yaml_str = self.verify_block_type(self.yaml)
        return ret_yaml_str

    def verify_block_type(self, yaml_str: str) -> str:
        """
        Using embedding to convert random block types to valid lowdefy block
        :param yaml_str: Original yaml file string
        :return: Converted yaml file string
        """
        cur_yaml = yaml_str.split("\n")
        idx = 0
        while idx < len(cur_yaml):
            line = cur_yaml[idx]
            print(line)
            tokens = line.split(":")
            key = tokens[0]
            if key.strip() == "type":
                # indent_level = key.rindex(" ") + 1
                query_type = tokens[1].strip().split(" ")[0]
                all_types = self.all_embedding_df.columns.values.tolist()
                cache = {}
                if query_type not in all_types:
                    if query_type not in cache:
                        query_type_embedding = openai.Embedding.create(
                            model="text-embedding-ada-002",
                            input=query_type)["data"][0]["embedding"]
                        score, valid_type = YAMLValidator.find_best_type(query_type_embedding, self.all_embedding_df)
                        cache[query_type] = valid_type
                    else:
                        valid_type = cache[query_type]
                    cur_yaml[idx] = f"{key}: {valid_type}"
            idx += 1
        return "\n".join(cur_yaml)

    def verify_indentation(self, yaml_str: str) -> str:
        pass

    @staticmethod
    def vector_similarity(x: list[float], y: list[float]) -> float:
        """
        Compute cosine similarity between two vectors.
        :param x: Vector one
        :param y: Vector two
        :return: Cosine similarity between input vectors
        """
        return np.dot(np.array(x), np.array(y)) / (norm(np.array(x)) * norm(np.array(y)))

    @staticmethod
    def find_best_type(query_key, embedding_df) -> tuple[float, str]:
        """
        Find the value whose embedding vector has the highest cosine similarity with query
        :param query_key: The embedding vector of query
        :param embedding_df: Dataframe that stores all the embedding vectors
        :return:
        """
        best_type = (0, "")
        for col_name in embedding_df.columns.tolist():
            section_embedding = embedding_df[col_name].values.tolist()
            cur_score = YAMLValidator.vector_similarity(query_key, section_embedding)

            if cur_score > best_type[0]:
                best_type = cur_score, col_name
        return best_type

    @staticmethod
    def parse(org_str: str) -> str:
        """
        Given the original output string generated from LLM, parse the yaml file provided in the output.
        :param org_str: original string from LLM
        :return: the string of yaml file
        """
        reading_state = 0
        yaml_lines = []
        for line in org_str.split("\n"):
            if line[:3] == "```" and reading_state == 0:
                reading_state = 1
                continue
            elif line[:3] == "```":
                break
            if reading_state == 1:
                yaml_lines.append(line)
        ret = "\n".join(yaml_lines)
        return ret
