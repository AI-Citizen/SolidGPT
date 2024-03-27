import logging
import os

from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import SDE_NOTION_CHAT_ASSUMPTION
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *
import tiktoken

HistoryContextSeperator = '*------*'
HistoryUserInuptLabel = 'UserInput:'
HistorySystemOutputLabel = 'SystemOutput:'


class HistoryContext:
    system_output: str
    user_input: str

    def __init__(self, system_output, user_input):
        self.system_output = system_output
        self.user_input = user_input

    def __str__(self):
        return f"User Input: {self.user_input}, System Output: {self.system_output}"


class NotionChat(WorkSkill):
    Memory_Length = 3

    def __init__(self, scope):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_NOTION_CHAT
        self.onboarding_id_input = SkillInput(
            "Onboarding ID",
            SkillIOParamCategory.PlainText,
        )
        self.message = SkillInput(
            "User Message",
            SkillIOParamCategory.PlainText,
        )
        self.history_context = SkillInput(
            "History Context",
            SkillIOParamCategory.PlainText,
        )
        self.scope = scope
        self.add_input(self.onboarding_id_input)
        self.add_input(self.message)
        self.add_input(self.history_context)
        self.output_response = SkillOutput(
            "GPT response",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_response)
        self.code_plan_content = None
        self.history_contexts_content = []
        self.page_list = []
        self.related_files_content = None
        self.message_content = None
        self.related_notion_file_content = None
        self.VECTOR_SEARCH_RESULT_LIMIT = 5
        self.model_version = ConfigReader().config_map['openai_model']
        self.encoding = tiktoken.encoding_for_model(self.model_version)

    def _read_input(self):
        # Get from cache or read from file
        self.message_content = self.message.content
        self.history_contexts_content = self.__get_history_context()
        self.onboarding_id = self.onboarding_id_input.content
        self.page_list = list(map(lambda x: x[0], load_from_json(filename=os.path.join(LOCAL_STORAGE_OUTPUT_DIR, self.onboarding_id, "Pages.json"))))
        self.client = QdrantClient(path=os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.onboarding_id))

    def __get_history_context(self):
        path = self.get_input_path(self.history_context)
        if not os.path.exists(path):
            return []
        json_data = load_from_text(self.get_input_path(self.history_context), extension=".json")
        # print(json_data)
        # Load JSON data
        data = json.loads(json_data)

        # Extract HistoryContent list
        history_content = data["HistoryContent"]
        history_contexts_content = []

        # Create a list of HistoryContext objects
        for item in history_content:
            system_output = item["SystemOutput"]
            user_input = item["UserInput"]
            history_context = HistoryContext(system_output, user_input)
            history_contexts_content.append(history_context)
        return history_contexts_content

    def execution_impl(self):
        try:
            if len(self.scope) == 0 or (len(self.scope) == 1 and self.scope[0] == "notion/"):
                self.__build_unspecified_notion_prompt()
            else:
                self.__build_specified_notion_prompt()
            system_output = self.__run_chat_with_repo_model()
            # Save system_output into the history context
            current_context = HistoryContext(system_output, self.message_content)
            self.history_contexts_content.append(current_context)
            # Convert the list of HistoryContext objects to a list of dictionaries
            history_list = [{"UserInput": hc.user_input, "SystemOutput": hc.system_output} for hc in
                            self.history_contexts_content]

            # Create a dictionary with the HistoryContent key
            data = {"HistoryContent": history_list}

            save_to_json(data, self.history_context.param_path)
            # Show the result
            self._save_to_result_cache(self.output_response, str(self.__get_last_response()))
        except Exception as e:
            logging.error(f"Failed to run notion chat with error {e}")
            self.client.close()
            raise e

        # self._save_to_result_cache(self.output_response, system_output)
        self.client.close()
        return system_output

    def __run_chat_with_repo_model(self):
        logging.info("Running notion chat model...")
        solution_stream = self.gpt_manager.create_and_chat_with_model(
            prompt=f"""{SDE_NOTION_CHAT_ASSUMPTION}""",
            gpt_model_label="notion chat",
            temperature=0.01,
            model=self.model_version,
            input_message=self.__get_model_input(),
            is_stream=True
        )
        solution = ""
        for chunk in solution_stream:
            try:
                if chunk.choices[0].delta.content is not None:
                    solution += chunk.choices[0].delta.content
                    self.callback_func(solution)
            except Exception as e:
                # print(chunk, solution)
                logging.warn(f"Failed to get the delta content with error {e}")
                continue
        return solution

    # def __get_model_input(self):
    #     return f'''User Requirement: {self.message_content} \n
    #     Related Notion Files: {self.related_notion_file_content}\n
    #     Chat History Context: {self.history_contexts_content[-self.Memory_Length:] if len(self.history_contexts_content) > self.Memory_Length else self.history_contexts_content}\n'''

    def __get_model_input(self):
        return f'''User input: {self.message_content} \n
        Related Notion Files: {self.related_notion_file_content}\n'''

    def __get_last_response(self):
        return self.history_contexts_content[::-1][0].system_output

    def __find_top_notion(self, page_id):
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedding_query = embeddings_model.embed_query(self.message_content)
        search = self.client.search(
            collection_name=f"{self.onboarding_id}_{page_id}",
            query_vector=embedding_query,
            limit=self.VECTOR_SEARCH_RESULT_LIMIT
        )
        return search

    def __build_specified_notion_prompt(self):
        content_list = []
        for front_path in self.scope:
            page_id = front_path[7:]
            try:
                search = self.__find_top_notion(page_id)
                for segment in search:
                    name = segment.dict()["payload"]["page_name"]
                    content = segment.dict()["payload"]["content"]
                    content_list.append(f"Page Name: {name}\nNotion content:\n{content}")
            except Exception as e:
                logging.error(f"read notion content in notion chat failed. Error: {str(e)}")

        self.related_notion_file_content = "\n".join(content_list)
        return

    def __build_unspecified_notion_prompt(self):
        candidates = []
        for page_id in self.page_list:
            search = self.__find_top_notion(page_id)
            for element in search:
                score = element.dict()["score"]
                candidates.append((score, element))
        candidates.sort(key=lambda x: x[0])
        candidates = candidates[:self.VECTOR_SEARCH_RESULT_LIMIT]
        content_list = []
        for score, candidate in candidates:
            name = candidate.dict()["payload"]["page_name"]
            code = candidate.dict()["payload"]["content"]
            content_list.append(f"Page Name: {name}\nNotion content:\n{code}")
        self.related_notion_file_content = "\n".join(content_list)
        return
