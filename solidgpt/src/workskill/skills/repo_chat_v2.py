from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE, PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, SDE_CHAT_ADVISOR_ASSUMPTION, SDE_TECH_SOLUTION_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *

HistoryContextSeperator = '*------*'
HistoryUserInuptLabel = 'UserInput:'
HistorySystemOutputLabel = 'SystemOutput:'

class HistoryContext():
    system_output: str
    user_input: str

    def __init__(self, system_output, user_input):
        self.system_output = system_output
        self.user_input = user_input


    def __str__(self):
        return f"User Input: {self.user_input}, System Output: {self.system_output}"

class RepoChatV2(WorkSkill):
    Memory_Length = 3

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_REPO_CHAT
        self.code_plan = SkillInput(
            "Code Plan",
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
        self.relatived_code_file = SkillInput(
            "Relatived Code Files",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.code_plan)
        self.add_input(self.message)
        self.add_input(self.history_context)
        self.add_input(self.relatived_code_file)
        self.output_md = SkillOutput(
            "Chat Context",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_md)
        self.code_plan_content = None
        self.history_contexts_content = []
        self.message_content = None
        self.relatived_code_file_content = None

    def _read_input(self):
        # Get from cache or read from file
        self.code_plan_content = self.__get_input_content(self.code_plan)
        self.relatived_code_file_content = self.__get_input_content(self.relatived_code_file)
        self.message_content = self.message.content
        self.history_contexts_content = self.__get_history_context()

    def __get_input_content(self, skill_input : SkillInput):
        return load_from_text(self.get_input_path(skill_input), extension=".txt")
    
    def __get_history_context(self):
        json_data = load_from_text(self.get_input_path(self.history_context),extension=".json")
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
        system_output = self.__run_chat_with_repo_model()
        # Save system_output into the history context
        current_context = HistoryContext(system_output, self.message_content)
        self.history_contexts_content.append(current_context)
        # Convert the list of HistoryContext objects to a list of dictionaries
        history_list = [{"UserInput": hc.user_input, "SystemOutput": hc.system_output} for hc in self.history_contexts_content]

        # Create a dictionary with the HistoryContent key
        data = {"HistoryContent": history_list}

        save_to_json(data, self.history_context.param_path )
        # Show the result 
        self._save_to_result_cache(self.output_md, str(self.__get_last_response()))
        return

    def __run_chat_with_repo_model(self):
        logging.info("Running repo chat model...")
        model = self.gpt_manager.create_model(
            prompt=f"""{SDE_CHAT_ADVISOR_ASSUMPTION}""",
            gpt_model_label="repo_chat",
            temperature=0.01,
            model="gpt4",
        )
        solution = model.chat_with_model(self.__get_model_input())
        return solution

    def __get_model_input(self):
        return f'''QUESTION: {self.message_content} \n
        CODE PLAN: {self.code_plan_content} \n
        Relatived Code Files: {self.relatived_code_file_content}\n
        Chat History Context: { self.history_contexts_content[-self.Memory_Length:] if len(self.history_contexts_content) > self.Memory_Length else self.history_contexts_content}\n'''

    def __get_display_format(self):
        display_content = ''
        for context in self.history_contexts_content[::-1]:
            display_content += '**You:** \n'
            display_content += '\n'
            display_content += f"{context.user_input} \n"
            display_content += '\n'
            display_content += '**SolidGPT:** \n'
            display_content += '\n'
            display_content += f"{context.system_output} \n"
            display_content += '\n'
            display_content += "-------------------------------------\n"
        return display_content

    def __get_last_response(self):
        return self.history_contexts_content[::-1][0].system_output