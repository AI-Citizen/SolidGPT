import logging
import os
import shutil
import openai
import uuid
from solidgpt.src.constants import SKILL_NAME_NOTION_EMBED
from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.blobmanager import AzureBlobManager
from solidgpt.src.manager.promptresource import CODE_SUMMARY_V2, SUMMARY_CODE_SUMMARY_PYTHON, SUMMARY_PROJECT
from solidgpt.src.util.util import load_from_text, save_to_text, save_to_json
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill
from solidgpt.definitions import LOCAL_STORAGE_WORKSPACE_DIR, SUPPORT_EXTENSION, LOCAL_STORAGE_OUTPUT_DIR

from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, Distance, VectorParams
import json
from notion_client import Client


MAX_ONBOARDING_LENGTH = 500
class NotionEmbed(WorkSkill):
    onboarding_id: str = None

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_NOTION_EMBED
        self.gpt_manager = GPTManager._instance
        self.onboarding_id_input = SkillInput(
            "Onboarding ID",
            SkillIOParamCategory.PlainText,
        )
        self.page_id_input = SkillInput(
            "Page ID",
            SkillIOParamCategory.PlainText,
        )
        self.workspace_token_input = SkillInput(
            "Workspace Token",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.onboarding_id_input)
        self.add_input(self.page_id_input)
        self.add_input(self.workspace_token_input)
        self.skill_output = SkillOutput(
            "result message",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)
        self.base_path: str = ""
        self.file_list: list = []
        self.summary_list: list = []
        self.qdrant_path = ""

    def _read_input(self):
        if self.callback_func is not None:
            self.callback_func("Fetching page data...")
        self.notion = Client(auth=self.workspace_token_input.content)
        self.notion_result = self.get_all_pages_in_workspace(self.page_id_input.content)
        self.onboarding_id = self.onboarding_id_input.content
        self.qdrant_path = os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.onboarding_id)
        self.client = QdrantClient(path=self.qdrant_path)

    def execution_impl(self):
        logging.info("Start embedding...")
        if self.callback_func is not None:
            self.callback_func("Embedding page data...")
        page_data = []
        try:
            for r in self.notion_result:
                page_id = r[0]
                page_name = r[1]
                page_data.append([page_id, page_name])
                page_content = r[2]
                for c in page_content:
                    self.__embed_page_content(page_id, c, page_name)
        except Exception as e:
            self.client.close()
            logging.error(f"Error embedding page data: {e}")
            raise e
        self.client.close()
        logging.info(page_data)
        self._save_to_result_cache(self.skill_output, f"Indexing Successful. You can now start chatting with Notion. Be sure to enable **Chat with Notion** in the Settings. 👉")
        self._save_custom_result_to_result_cache(json.dumps(page_data))
        save_to_json(filename=os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.onboarding_id, "Pages.json"), data=page_data)
        return

    def __embed_page_content(self, page_id, content, page_name):
        payload_dict = {"page_id": page_id, "page_name": page_name, "content": content}
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedded_query = embeddings_model.embed_query(content)
        logging.info(f"Onboarding ID:{self.onboarding_id}\nSave this id to retrieve embedded data later.")
        try:
            self.client.upsert(
                collection_name=f"{self.onboarding_id}_{page_id}",
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        except ValueError:
            self.client.recreate_collection(
                collection_name=f"{self.onboarding_id}_{page_id}",
                vectors_config=VectorParams(size=len(embedded_query), distance=Distance.COSINE),
            )
            self.client.upsert(
                collection_name=f"{self.onboarding_id}_{page_id}",
                points=[
                    PointStruct(id=self.get_uuid(), vector=embedded_query, payload=payload_dict)
                ]
            )
        return

    @staticmethod
    def get_uuid():
        return str(uuid.uuid4().hex)

    def fetch_nested_pages(self, page_id, accumulated_pages, text_result):
        try:
            block_details = self.notion.blocks.retrieve(block_id=page_id)
            page_name = block_details.get("child_page", {"title": "Untitled"}).get("title", "Untitled")
            logging.info(f"Extracting notion page: {page_name}")

            start_cursor = None
            has_more = True
            blocks = []

            while has_more:
                response = self.notion.blocks.children.list(block_id=page_id, start_cursor=start_cursor)
                temp_blocks = response.get("results", [])
                blocks.extend(temp_blocks)
                # Update start_cursor and has_more based on the API response
                start_cursor = response.get('next_cursor', None)
                has_more = response.get('has_more', False)

            # print(json.dumps(blocks, indent=4))
            tr = self.retrieve_page_content(blocks[::])
            text_result.append([page_id, tr, page_name])
            for block in blocks:
                # If the block is a page, add it to the list and recurse
                if block["type"] == "child_page":
                    accumulated_pages.append(block)
                    self.fetch_nested_pages(block["id"], accumulated_pages, text_result)
                # Additionally, check for other types that can contain pages (e.g., databases) and implement similar logic
        except Exception as e:
            logging.error(f"Error fetching or processing page {page_id}: {e}")

    def get_all_pages_in_workspace(self, page_id):
        # This is a conceptual placeholder. You'd start with top-level pages shared with your integration.
        top_level_page_ids = [page_id]
        all_pages = []
        all_results = []
        for page_id in top_level_page_ids:
            self.fetch_nested_pages(page_id, all_pages, all_results)

        final_res = []
        for r in all_results:
            cut_content = self.cut_content_by_words(r[1])
            final_res.append([r[0], r[2], cut_content])
        # uncomment below logging for debugging purpose, or it will be too noisy
        # logging.info(json.dumps(final_res, indent=4))
        return final_res

    def retrieve_page_content_with_id(self, block_id):
        page_content = self.notion.blocks.children.list(block_id=block_id).get("results", [])
        return self.retrieve_page_content(page_content)

    def retrieve_page_content(self, page_content):
        res_str = ""
        while page_content:
            content = page_content.pop(0)
            content_type = content.get("type", "")
            has_children = content.get("has_children", False)
            cur_block_id = content.get("id", "")
            if content_type and content_type != "child_page":
                if has_children:
                    children = self.notion.blocks.children.list(block_id=cur_block_id).get("results", [])
                    page_content = children + page_content
                    continue
                else:
                    res_str += self.find_text_content(content) + " "
        return res_str

    def find_text_content(self, block, key='content'):
        """
        Recursively find text content within a Notion block.

        Args:
        - block (dict): The block or part of it to search through.
        - key (str): The key to look for that holds text content.

        Returns:
        - str: All found text content concatenated together.
        """
        if isinstance(block, dict):
            # If the block is a dictionary and contains the key, return its value
            if key in block:
                return block[key] + " "  # Adding a space for separation
            else:
                # Otherwise, recursively search in each value of the dictionary
                return "".join(self.find_text_content(value, key) for value in block.values())
        elif isinstance(block, list):
            # If the block is a list, recursively search in each item
            return "".join(self.find_text_content(item, key) for item in block)
        # If the block is neither a list nor a dictionary, return an empty string
        return ""

    def cut_content_by_words(self, page_content_str, word_limit=500):
        words = page_content_str.split()  # Split the content into words
        segments = []  # List to hold all segments
        current_segment = []  # Current segment being filled with words

        for word in words:
            # Add word to current segment if it doesn't exceed the word limit
            if len(current_segment) < word_limit:
                current_segment.append(word)
            else:
                # If the current segment reached the word limit, join it into a string and add to segments list
                segments.append(' '.join(current_segment))
                current_segment = [word]  # Start a new segment with the current word

        # Add the last segment if it has any words
        if current_segment:
            segments.append(' '.join(current_segment))

        return segments
