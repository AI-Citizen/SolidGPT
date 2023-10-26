import autogen
import openai
from solidgpt.src.configuration.configreader import ConfigReader


class SolidUserProxyAgent(autogen.UserProxyAgent):
    def get_human_input(self, prompt: str) -> str:
        print(prompt)
        reply = ""
        # get reply from frontend
        reply = input()
        # print("####################USER PROXY LAST MESSAGE#######################")
        # print(self.last_message()["content"])
        # print("####################USER PROXY LAST MESSAGE END#######################")
        return reply


class SolidAssistantAgent(autogen.AssistantAgent):
    def get_human_input(self, prompt: str) -> str:
        print(prompt)
        reply = ""
        # get reply from frontend
        reply = input()
        # print("####################ASSISTANT LAST MESSAGE#######################")
        # print(self.last_message()["content"])
        # print("####################ASSISTANT LAST MESSAGE END#######################")
        return reply


class AutoGenManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AutoGenManager, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance

    def __init__(self, if_show_reply=False):
        # read api key from config file
        global_openai_key = ConfigReader().get_property("openai_api_key")
        if global_openai_key is not None and global_openai_key != "":
            openai.api_key = global_openai_key
        self.__default_model = ConfigReader().get_property("openai_model")
        self.config_list = [{"model": self.__default_model, "api_key": global_openai_key}]
        self.gpt_models_container = {}
        self.if_show_reply = if_show_reply
        self.planner = None
        self.planner_user = None
        self.assistant = None
        self.user_proxy = None

    def run(self, prompt):
        self.construct_agents()
        self.user_proxy.initiate_chat(
            self.assistant,
            message=prompt,
        )

    def construct_agents(self):
        self.generate_planner()
        self.generate_planner_user()
        self.generate_assistant()
        self.generate_user_proxy()

    def generate_planner(self):
        planner = SolidAssistantAgent(
            name="planner",
            llm_config={"config_list": self.config_list},
            # the default system message of the AssistantAgent is overwritten here
            system_message="You are a helpful AI assistant. You suggest coding and reasoning steps for another AI assistant to accomplish a task. Do not suggest concrete code. For any action beyond writing code or reasoning, convert it to a step that can be implemented by writing code. For example, browsing the web can be implemented by writing code that reads and prints the content of a web page. Finally, inspect the execution result. If the plan is not good, suggest a better plan. If the execution is wrong, analyze the error and suggest a fix."
        )
        self.planner = planner

    def generate_planner_user(self):
        planner_user = SolidUserProxyAgent(
            name="planner_user",
            max_consecutive_auto_reply=0,  # terminate without auto-reply
            human_input_mode="NEVER",
        )
        self.planner_user = planner_user

    def ask_planner(self, message):
        self.planner_user.initiate_chat(self.planner, message=message)
        # return the last message received from the planner
        return self.planner_user.last_message()["content"]

    def generate_assistant(self):
        assistant = SolidAssistantAgent(
            name="assistant",
            llm_config={
                "temperature": 0,
                "request_timeout": 600,
                "seed": 42,
                "model": self.__default_model,
                "config_list": self.config_list,
                "functions": [
                    {
                        "name": "ask_planner",
                        "description": "ask planner to: 1. get a plan for finishing a task, 2. verify the execution result of the plan and potentially suggest new plan.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "message": {
                                    "type": "string",
                                    "description": "question to ask planner. Make sure the question include enough context, such as the code and the execution result. The planner does not know the conversation between you and the user, unless you share the conversation with the planner.",
                                },
                            },
                            "required": ["message"],
                        },
                    },
                ],
            }
        )
        self.assistant = assistant

    def generate_user_proxy(self):
        user_proxy = SolidUserProxyAgent(
            name="user_proxy",
            human_input_mode="ALWAYS",
            max_consecutive_auto_reply=10,
            is_termination_msg=lambda x: "content" in x and x["content"] is not None and x["content"].rstrip().endswith(
                "TERMINATE"),
            code_execution_config={"work_dir": "planning"},
            function_map={"ask_planner": self.ask_planner},
        )
        self.user_proxy = user_proxy
