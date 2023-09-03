import os
import openai
import pandas as pd
import numpy as np
from numpy.linalg import norm
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.definitions import ROOT_DIR


class YAMLValidator:
    def __init__(self, yaml_str: str, filename: str, subpages: list):
        self.yaml = yaml_str
        self.filename = filename
        self.subpages = subpages
        self.yaml_list = self.yaml.split("\n")
        self.homepage_id = None
        self.container_df = pd.read_csv(
            os.path.join(ROOT_DIR, "src", "tools", "lowdefy", "embedding", "container_block_embedding.csv"))
        self.input_df = pd.read_csv(
            os.path.join(ROOT_DIR, "src", "tools", "lowdefy", "embedding", "input_block_embedding.csv"))
        self.display_df = pd.read_csv(
            os.path.join(ROOT_DIR, "src", "tools", "lowdefy", "embedding", "display_block_embedding.csv"))
        self.all_embedding_df = pd.concat([self.container_df, self.input_df, self.display_df], axis=1)
        openai.api_key = ConfigReader().get_property("openai_api_key")

    def validate(self) -> str:
        """
        Check and convert the GPT created yaml file string to valid lowdefy yaml file string
        :return: Converted valid lowdefy yaml file string
        """
        self.verify_block_type()
        self.remove_keys("events")
        self.remove_keys("requests")
        self.verify_duplicate_keys()
        if len(self.subpages) > 0 and self.filename == "lowdefy":
            self.verify_reference(self.subpages)
            self.verify_menu(self.subpages)
            self.verify_duplicate_pages()
        return "\n".join(self.yaml_list)

    def verify_block_type(self):
        """
        Using embedding to convert random block types to valid lowdefy block
        :return: Converted yaml file string
        """
        idx = 0
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            if key == "id":
                self.yaml_list[idx] = f"{key}: {self.filename}"
            elif key.strip() == "type":
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
                    self.yaml_list[idx] = f"{key}: {valid_type}"
            idx += 1
        return

    def remove_blocks(self, key, idx):
        indentation = key.rfind(" ") if "-" not in key else key.rfind("-") - 1
        next_indentation = float("inf")
        while idx < len(self.yaml_list) and next_indentation > indentation:
            self.yaml_list.pop(idx)
            if idx >= len(self.yaml_list):
                break
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            next_indentation = key.rfind(" ") if "-" not in key else key.rfind("-") - 1

    def remove_keys(self, query_key):
        idx = 0
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            if key.strip() == query_key:
                self.remove_blocks(key, idx)
            idx += 1
        return

    def verify_duplicate_pages(self):
        idx = 0
        page_flag = False
        page_indentation = float("inf")
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            indentation = key.rfind(" ") if "-" not in key else key.rfind("-") - 1
            if page_flag and indentation <= page_indentation:
                page_flag = False
            if key.strip() == "pages":
                page_flag = True
                page_indentation = indentation
            if len(tokens) > 0:
                # print(key == "  - id")
                if page_flag and key == "  - id" and tokens[1].strip().split(" ")[0] in self.subpages:
                    self.remove_blocks(key, idx)
                    idx -= 1
            idx += 1
        return

    def verify_duplicate_keys(self):
        seen_keys = set()
        cur_path_list = []
        idx = 0
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            if line == "":
                self.yaml_list.pop(idx)
                continue
            tokens = line.split(":")
            key = tokens[0]
            indentation = key.rfind(" ") if "-" not in key else key.rfind("-") - 1
            indent_level = indentation // 2 if indentation >= 0 else 0
            if len(cur_path_list) <= indent_level:
                cur_path_list.append(line.strip())
            else:
                while len(cur_path_list) > indent_level:
                    cur_path_list.pop()
                cur_path_list.append(line.strip())
            cur_path = tuple(cur_path_list)
            if cur_path in seen_keys:
                self.remove_blocks(key, idx)
            seen_keys.add(cur_path)
            idx += 1
        return

    def verify_menu(self, page_list: list[str]):
        idx = 0
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            if key.strip() == "menus":
                self.remove_blocks(key, idx)
            idx += 1

        menu_list = ["menus:", "  - id: default", "    links:"]
        page_list.insert(0, self.homepage_id)
        for page in page_list:
            cur_list = [f"        - id: {page}", "          type: MenuLink", "          properties:",
                        f"            title: {page.capitalize()}", f"          pageId: {page}"]
            menu_list.extend(cur_list)
        self.yaml_list.extend(menu_list)
        return

    def verify_reference(self, page_list: list[str]):
        ref_list = [f"  - _ref: {page_name}.yaml" for page_name in page_list]
        idx = 0
        flag = False
        while idx < len(self.yaml_list):
            line = self.yaml_list[idx]
            tokens = line.split(":")
            key = tokens[0]
            if key == "pages":
                self.yaml_list[idx + 1:1] = ref_list
                flag = True
            if flag and key == "  - id":
                self.homepage_id = tokens[1].strip().split(" ")[0]
                break
            idx += 1
        return

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
