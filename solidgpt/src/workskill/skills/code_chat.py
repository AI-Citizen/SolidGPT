import logging
import os

from solidgpt.src.configuration.configreader import ConfigReader
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import SDE_CHAT_ADVISOR_ASSUMPTION, SDE_CODE_CHAT_ASSUMPTION
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


class CodeChat(WorkSkill):
    Memory_Length = 3

    def __init__(self, scope):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_CODE_CHAT
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
        self.related_files_content = None
        self.message_content = None
        self.related_code_file_content = None
        self.VECTOR_SEARCH_RESULT_LIMIT = 1
        self.model_version = ConfigReader().config_map['openai_model']
        self.encoding = tiktoken.encoding_for_model(self.model_version)

    def _read_input(self):
        # Get from cache or read from file
        self.message_content = self.message.content
        self.history_contexts_content = self.__get_history_context()
        self.onboarding_id = self.onboarding_id_input.content
        self.client = QdrantClient(path=os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "qdrant", self.onboarding_id))

    def __get_history_context(self):
        path = self.get_input_path(self.history_context)
        if not os.path.exists(path):
            return []
        json_data = load_from_text(self.get_input_path(self.history_context), extension=".json")
        print(json_data)
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
            if len(self.scope) == 0 or (len(self.scope) == 1 and self.scope[0] == "codebase/"):
                self.__build_unspecified_code_prompt()
            else:
                self.__build_specified_code_prompt()
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
            logging.error(f"Code chat failed with error: {str(e)}")
            self.client.close()
            raise e
        # self._save_to_result_cache(self.output_response, system_output)
        self.client.close()
        return system_output

    def __run_chat_with_repo_model(self):
        logging.info("Running code chat model...")
        solution_stream = self.gpt_manager.create_and_chat_with_model(
            prompt=f"""{SDE_CODE_CHAT_ASSUMPTION}""",
            gpt_model_label="code chat",
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
    #     Related Code Files: {self.related_code_file_content}\n
    #     Chat History Context: {self.history_contexts_content[-self.Memory_Length:] if len(self.history_contexts_content) > self.Memory_Length else self.history_contexts_content}\n'''
    
    def __get_model_input(self):
        return f'''User Input: {self.message_content} \n
        Related Code Files: {self.related_code_file_content}\n'''

    def __get_last_response(self):
        return self.history_contexts_content[::-1][0].system_output

    def __find_top_code(self):
        embeddings_model = OpenAIEmbeddings(openai_api_key=openai.api_key)
        embedding_query = embeddings_model.embed_query(self.message_content)
        search = self.client.search(
            collection_name=self.onboarding_id,
            query_vector=embedding_query,
            limit=self.VECTOR_SEARCH_RESULT_LIMIT
        )
        return search

    def __build_specified_code_prompt(self):
        content_list = []
        for front_path in self.scope:
            real_path = front_path[9:]
            try:
                with open(real_path, "r") as file:
                    content = file.read()
                    content_list.append(f"File Path: {real_path}\nCode content:\n{content}")
            except Exception as e:
                logging.error(f"read file content in code chat failed. Error: {str(e)}")

        self.related_code_file_content = "\n".join(content_list)
        return

    def __build_unspecified_code_prompt(self):
        candidates = self.__find_top_code()
        content_list = []
        for candidate in candidates:
            name = candidate.dict()["payload"]["filename"]
            code = candidate.dict()["payload"]["code"]
            content_list.append(f"File Path: {name}\nCode content:\n{code}")
        self.related_code_file_content = "\n".join(content_list)
        return
