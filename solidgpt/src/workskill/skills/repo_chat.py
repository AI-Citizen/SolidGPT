from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PRODUCT_MANAGER_5H2W_OUTPUT_TEMPLATE, PRODUCT_MANAGER_ANALYSIS_ROLE_ASSUMPTION, PRODUCT_MANAGER_BRAINSTORM_OUTPUT_TEMPLATE, PRODUCT_MANAGER_BRAINSTORM_ROLE_ASSUMPTION, PRODUCT_MANAGER_PRD_OUTPUT_TEMPLATE, PRODUCT_MANAGER_PRD_ROLE_ASSUMPTION, SDE_TECH_SOLUTION_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.skills.query_code import Cache_Label_Query_Code
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

class RepoChat(WorkSkill):
    Memory_Length = 1

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_REPO_CHAT
        self.code_schema = SkillInput(
            "Code Schema",
            SkillIOParamCategory.PlainText,
        )
        self.summary = SkillInput(
            "Product Summary",
            SkillIOParamCategory.PlainText,
        )
        self.requirements = SkillInput(
            "Requirements",
            SkillIOParamCategory.PlainText,
        )
        self.history_context = SkillInput(
            "History Context",
            SkillIOParamCategory.PlainText,
        )
        #self.add_input(self.relatived_files)
        self.add_input(self.code_schema)
        self.add_input(self.summary)
        self.add_input(self.requirements)
        self.add_input(self.history_context)
        self.output_md = SkillOutput(
            "Tech Solution Markdown",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.output_md)
        self.relatived_files_content = None
        self.code_schema_content = None
        self.summary_content = None
        self.history_contexts_content = []
        self.requirements_content = None

    def _read_input(self):
        # Get from cache or read from file
        self.relatived_files_content = self._get_graph_cached_content(Cache_Label_Query_Code)
        self.code_schema_content = self.__get_input_content(self.code_schema)
        self.summary_content = self.__get_input_content(self.summary)
        self.requirements_content = self.requirements.content
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
        current_context = HistoryContext(system_output, self.requirements_content)
        current_context.system_output
        self.history_contexts_content.append(current_context)
        # Convert the list of HistoryContext objects to a list of dictionaries
        history_list = [{"UserInput": hc.user_input, "SystemOutput": hc.system_output} for hc in self.history_contexts_content]

        # Create a dictionary with the HistoryContent key
        data = {"HistoryContent": history_list}

        save_to_json(data, self.history_context.param_path )
        # Show the result 
        self._save_to_result_cache(self.output_md, str(self.__get_display_format()))

        return
    
    def __run_chat_with_repo_model(self):
        logging.info("Running repo chat model...")
        model = self.gpt_manager.create_model(
            prompt=f"""Assume you are principle SDE, you will be an code expert to 
            give code plan, 
            code advise, 
            explain the code.
            Please base on the Project Instruction, Code Schema,
            Relatived code files, and Background I provide below and your professional relatived knowledge
            to response to the Requirements. The requirements as follow: """,
            gpt_model_label="repo_chat",
            temperature=0.01,
            model="gpt4",
        )
        solution = model.chat_with_model(self.__get_model_input())
        return solution
    
    def __get_model_input(self):
        return f'''Requirements: {self.requirements_content} \n 
        And the repository information as below
        Project Instruction: {self.summary_content} \n 
        Code schema: {self.code_schema_content} \n
        Relatived code files: {self.relatived_files_content} \n
        Background: { self.history_contexts_content[-self.Memory_Length:] if len(self.history_contexts_content) > self.Memory_Length else self.history_contexts_content}\n
         and always input the Markdown clean format '''
    
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