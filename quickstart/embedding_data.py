import logging
import os
import sys
from solidgpt.definitions import LOCAL_STORAGE_DIR
from solidgpt.src.manager.embedding.embeddingmanager import EmbeddingManager
from solidgpt.src.manager.embedding.embeddingmodel import EmbeddingModelParameter

def embedding(label:str, original_resources_path = os.path.join(LOCAL_STORAGE_DIR, "embedding", "originalresources")):
    embedding_manager = EmbeddingManager()
    embedding_manager.add_embed_model(label, EmbeddingModelParameter(
        resource_name= label,
        original_resources_folder_path= original_resources_path,
        divided_resources_folder_path= os.path.join(LOCAL_STORAGE_DIR, "embedding", "dividedresources"),
        embedded_resources_folder_path= os.path.join(LOCAL_STORAGE_DIR, "embedding", "embeddedresources"),
        has_embedded=False
    ))

def main():
    if len(sys.argv) <2 :  # Adjust this number based on the number of arguments you expect
        logging.info("Usage: python3 embedding_data.py")
        sys.exit(1)
    elif len(sys.argv) == 2:
        label = sys.argv[1]
        embedding(label=label)
    elif len(sys.argv) == 3:
        label = sys.argv[1]
        original_resources_path = sys.argv[2]
        embedding(label=label, original_resources_path=original_resources_path)
    
if __name__ == "__main__":
   main()