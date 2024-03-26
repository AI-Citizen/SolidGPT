import json
import os
import sys
import openai
import uuid
from qdrant_client import QdrantClient
from langchain.embeddings import OpenAIEmbeddings
from qdrant_client.http.models import PointStruct, Distance, VectorParams
from solidgpt.definitions import *


def save_to_json(data, filename="data.json"):
    create_directories_if_not_exist(filename)
    # Save data to a JSON file
    with open(filename, "w") as json_file:
        print(json.dump(data, json_file, indent=4))


def load_from_json(filename="data.json"):
    # Load data from a JSON file
    with open(filename, "r") as json_file:
        loaded_data = json.load(json_file)
    return loaded_data


def save_to_md(filename, content: str, path = "") -> str:
    create_directories_if_not_exist(filename)
    path = os.path.join(ROOT_DIR, path)
    full_path = os.path.join(path, filename)
    with open(full_path, "w") as md_file:
        md_file.write(content)
    logging.info(f"Information saved to {full_path}")
    return full_path


def save_to_md2(filename, content: str) -> str:
    create_directories_if_not_exist(filename)
    full_path = filename
    full_path = add_extension_if_not_exist(full_path, ".md")
    with open(full_path, "w") as md_file:
        md_file.write(content)
        md_file.flush()
    logging.info(f"Information saved to {full_path}")
    return full_path


def save_to_yaml(filename, content: str) -> str:
    create_directories_if_not_exist(filename)
    full_path = filename
    full_path = add_extension_if_not_exist(full_path, ".yaml")
    with open(full_path, "w", encoding='utf-8') as md_file:
        md_file.write(content)
        md_file.flush()
    logging.info(f"Information saved to {full_path}")
    return full_path


def save_to_text(filename, content):
    create_directories_if_not_exist(filename)
    full_path = filename
    full_path = add_extension_if_not_exist(full_path, ".txt")
    with open(full_path, "w", encoding='utf-8') as txt_file:
        txt_file.write(content)
    logging.info(f"Information saved to {full_path}")
    return full_path


def create_directories_if_not_exist(filepath: str):
    dir_name = os.path.dirname(filepath)
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    return


def load_from_text(filename, path = "", extension = ".md") -> str:
    full_path = os.path.join(path, filename)
    full_path = add_extension_if_not_exist(full_path, extension)
    with open(full_path, "r", encoding='utf-8') as md_file:
        content = md_file.read()
    logging.info(f"Information loaded from {full_path}")
    return content

def add_extension_if_not_exist(input_string, extension):
    if not input_string.endswith(extension):
        return input_string + extension
    else:
        return input_string


def same_string(s1: str, s2: str, case_sensitive: bool = False):
    if case_sensitive:
        return s1 == s2
    return s1.lower() == s2.lower()


def print_error_message(message):
    print(f"Error: {message}", file=sys.stderr)


def delete_directory_contents(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                os.remove(file_path)
                print(f"Deleted file: {file_path}")
            except Exception as e:
                print(f"Error deleting file {file_path}: {str(e)}")
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            try:
                os.rmdir(dir_path)
                print(f"Deleted directory: {dir_path}")
            except Exception as e:
                print(f"Error deleting directory {dir_path}: {str(e)}")


def embed_templates():
    qdrant_path = os.path.join(SRC_DIR, "tools", "qdrant", "embedding")
    client = QdrantClient(path=qdrant_path)
    template_lists = list(filter(lambda x: os.path.isdir(os.path.join(SRC_DIR, "tools", "templates", x)),
                                 os.listdir(os.path.join(SRC_DIR, "tools", "templates"))))

    def get_uuid():
        return str(uuid.uuid4().hex)

    def __embed_summary(summary, path):
        payload_dict = {"path": path, "summary": summary}
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedded_query = embeddings_model.embed_query(summary)
        try:
            client.upsert(
                collection_name="templates",
                points=[
                    PointStruct(id=get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        except ValueError:
            client.recreate_collection(
                collection_name="templates",
                vectors_config=VectorParams(size=len(embedded_query), distance=Distance.COSINE),
            )
            client.upsert(
                collection_name="templates",
                points=[
                    PointStruct(id=get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        return

    for cur_dir in template_lists:
        cur_path = os.path.join(SRC_DIR, "tools", "templates", cur_dir)
        readme = os.path.join(cur_path, "README.md")
        with open(readme) as f:
            content = f.read()
            __embed_summary(content, cur_path)
    return


if __name__ == "__main__":
    # embed_templates()
    pass
