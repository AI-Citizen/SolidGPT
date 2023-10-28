import autogen
import openai
from solidgpt.src.configuration.configreader import ConfigReader
from typing import Callable, Dict, Optional, Union

from solidgpt.src.manager.promptresource import DEFAULT_SYSTEM_MESSAGE, ASSISTANT_SYSTEM_MESSAGE


class SolidUserProxyAgent(autogen.UserProxyAgent):

    def __init__(
            self,
            name: str,
            is_termination_msg: Optional[Callable[[Dict], bool]] = None,
            max_consecutive_auto_reply: Optional[int] = None,
            human_input_mode: Optional[str] = "ALWAYS",
            function_map: Optional[Dict[str, Callable]] = None,
            code_execution_config: Optional[Union[Dict, bool]] = None,
            default_auto_reply: Optional[Union[str, Dict, None]] = "",
            llm_config: Optional[Union[Dict, bool]] = False,
            system_message: Optional[str] = "",
            call_back=None,
    ):
        super().__init__(
            name,
            system_message,
            is_termination_msg,
            max_consecutive_auto_reply,
            human_input_mode,
            function_map,
            code_execution_config,
            llm_config,
            default_auto_reply,
        )
        self.call_back_func = call_back

    def get_human_input(self, prompt: str) -> str:
        print(prompt)
        reply = ""
        # get reply from frontend
        reply = input()
        if self.call_back_func:
            reply = self.call_back_func()
        # print("####################USER PROXY LAST MESSAGE#######################")
        # print(self.last_message()["content"])
        # print("####################USER PROXY LAST MESSAGE END#######################")
        return reply


class SolidAssistantAgent(autogen.AssistantAgent):

    def __init__(
            self,
            name: str,
            system_message: Optional[str] = DEFAULT_SYSTEM_MESSAGE,
            llm_config: Optional[Union[Dict, bool]] = None,
            is_termination_msg: Optional[Callable[[Dict], bool]] = None,
            max_consecutive_auto_reply: Optional[int] = None,
            human_input_mode: Optional[str] = "NEVER",
            code_execution_config: Optional[Union[Dict, bool]] = False,
            call_back=None,
            **kwargs,
    ):
        super().__init__(
            name,
            system_message,
            is_termination_msg,
            max_consecutive_auto_reply,
            human_input_mode,
            code_execution_config=code_execution_config,
            llm_config=llm_config,
            **kwargs,
        )
        self.call_back_func = call_back

    def get_human_input(self, prompt: str) -> str:
        print(prompt)
        reply = ""

        # assistant should not get any human input though
        if self.call_back_func:
            reply = self.call_back_func()

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

    @staticmethod
    def get_customized_assistant_agent(name: str,
                                       system_message: Optional[str] = DEFAULT_SYSTEM_MESSAGE,
                                       llm_config: Optional[Union[Dict, bool]] = None,
                                       is_termination_msg: Optional[Callable[[Dict], bool]] = None,
                                       max_consecutive_auto_reply: Optional[int] = None,
                                       human_input_mode: Optional[str] = "NEVER",
                                       code_execution_config: Optional[Union[Dict, bool]] = False,
                                       call_back=None,
                                       **kwargs):
        return SolidAssistantAgent(
            name,
            system_message,
            is_termination_msg,
            max_consecutive_auto_reply,
            human_input_mode,
            code_execution_config,
            call_back,
            llm_config=llm_config,
            **kwargs)

    @staticmethod
    def get_customized_user_proxy_agent(name: str,
                                        is_termination_msg: Optional[Callable[[Dict], bool]] = None,
                                        max_consecutive_auto_reply: Optional[int] = None,
                                        human_input_mode: Optional[str] = "ALWAYS",
                                        function_map: Optional[Dict[str, Callable]] = None,
                                        code_execution_config: Optional[Union[Dict, bool]] = None,
                                        default_auto_reply: Optional[Union[str, Dict, None]] = "",
                                        llm_config: Optional[Union[Dict, bool]] = False,
                                        system_message: Optional[str] = "",
                                        call_back=None):
        return SolidUserProxyAgent(
            name,
            system_message,
            is_termination_msg,
            max_consecutive_auto_reply,
            human_input_mode,
            function_map,
            code_execution_config,
            llm_config,
            default_auto_reply,
            call_back)

    def construct_agents(self):
        self.planner = self.generate_default_planner()
        self.planner_user = self.generate_default_planner_user()
        self.assistant = self.generate_default_assistant()
        self.user_proxy = self.generate_default_user_proxy()
        return

    def generate_default_planner(self):
        # todo: update callback function
        planner = SolidAssistantAgent(
            name="planner",
            llm_config={"config_list": self.config_list},
            # the default system message of the AssistantAgent is overwritten here
            system_message=DEFAULT_SYSTEM_MESSAGE)
        return planner

    def generate_default_planner_user(self):
        # todo: update callback function
        planner_user = SolidUserProxyAgent(
            name="planner_user",
            max_consecutive_auto_reply=0,  # terminate without auto-reply
            human_input_mode="NEVER",
        )
        return planner_user

    def ask_planner(self, message):
        self.planner_user.initiate_chat(self.planner, message=message)
        # return the last message received from the planner
        return self.planner_user.last_message()["content"]

    def generate_default_assistant(self):
        # todo: update callback function
        assistant = SolidAssistantAgent(
            name="assistant",
            system_message=ASSISTANT_SYSTEM_MESSAGE,
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
        return assistant

    def generate_default_user_proxy(self):
        # todo: update callback function
        user_proxy = SolidUserProxyAgent(
            name="user_proxy",
            human_input_mode="ALWAYS",
            max_consecutive_auto_reply=10,
            is_termination_msg=lambda x: "content" in x and x["content"] is not None and x["content"].rstrip().endswith(
                "TERMINATE"),
            code_execution_config={"work_dir": "planning"},
            function_map={"ask_planner": self.ask_planner},
        )
        return user_proxy
