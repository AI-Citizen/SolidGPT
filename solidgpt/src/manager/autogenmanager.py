import logging

import autogen
from autogen import oai
import openai
from solidgpt.src.configuration.configreader import ConfigReader
from typing import Callable, Dict, Optional, Union

from solidgpt.src.manager.promptresource import DEFAULT_SYSTEM_MESSAGE, ASSISTANT_SYSTEM_MESSAGE


def colored(x, *args, **kwargs):
    return x


class SolidUserProxyAgent(autogen.UserProxyAgent):

    manager = None
    callback_map = {

    }

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
    ):
        super().__init__(
            name=name,
            system_message=system_message,
            is_termination_msg=is_termination_msg,
            max_consecutive_auto_reply=max_consecutive_auto_reply,
            human_input_mode=human_input_mode,
            function_map=function_map,
            code_execution_config=code_execution_config,
            llm_config=llm_config,
            default_auto_reply=default_auto_reply,
        )

    def _print_received_message(self, message: Union[Dict, str], sender):
        # print the message received
        self.manager.add_message(sender.name, "(to", f"{self.name}):\n")
        if message.get("role") == "function":
            func_print = f"***** Response from calling function \"{message['name']}\" *****"
            self.manager.add_message(func_print)
            self.manager.add_message(message["content"])
            self.manager.add_message("*" * len(func_print))
        else:
            content = message.get("content")
            if content is not None:
                if "context" in message:
                    content = oai.ChatCompletion.instantiate(
                        content,
                        message["context"],
                        self.llm_config and self.llm_config.get("allow_format_str_template", False),
                    )
                self.manager.add_message(content)
            if "function_call" in message:
                func_print = f"***** Suggested function Call: {message['function_call'].get('name', '(No function name found)')} *****"
                self.manager.add_message(func_print)
                self.manager.add_message("Arguments: ")
                self.manager.add_message(message["function_call"].get("arguments", "(No arguments found)"))
                self.manager.add_message("*" * len(func_print))
        self.manager.add_message("")
        self.manager.add_message("-" * 80)

    def get_human_input(self, prompt: str) -> str:
        reply = ""
        # get reply from frontend
        msg = self.manager.retrieve_message()
        if self.callback_map.get("autogen_update_result_callback"):
            self.callback_map.get("autogen_update_result_callback")(msg)
        # display the chat
        logging.info(msg)

        if self.callback_map.get("autogen_message_input_callback"):
            reply = self.callback_map.get("autogen_message_input_callback")()
        else:
            reply = input()

        return reply


class SolidAssistantAgent(autogen.AssistantAgent):

    manager = None

    def __init__(
            self,
            name: str,
            system_message: Optional[str] = DEFAULT_SYSTEM_MESSAGE,
            llm_config: Optional[Union[Dict, bool]] = None,
            is_termination_msg: Optional[Callable[[Dict], bool]] = None,
            max_consecutive_auto_reply: Optional[int] = None,
            human_input_mode: Optional[str] = "NEVER",
            code_execution_config: Optional[Union[Dict, bool]] = False,
            **kwargs,
    ):
        super().__init__(
            name=name,
            system_message=system_message,
            is_termination_msg=is_termination_msg,
            max_consecutive_auto_reply=max_consecutive_auto_reply,
            human_input_mode=human_input_mode,
            code_execution_config=code_execution_config,
            llm_config=llm_config,
            **kwargs,
        )

    def _print_received_message(self, message: Union[Dict, str], sender):
        # print the message received
        self.manager.add_message(sender.name, "(to", f"{self.name}):\n")
        if message.get("role") == "function":
            func_print = f"***** Response from calling function \"{message['name']}\" *****"
            self.manager.add_message(func_print)
            self.manager.add_message(message["content"])
            self.manager.add_message("*" * len(func_print))
        else:
            content = message.get("content")
            if content is not None:
                if "context" in message:
                    content = oai.ChatCompletion.instantiate(
                        content,
                        message["context"],
                        self.llm_config and self.llm_config.get("allow_format_str_template", False),
                    )
                self.manager.add_message(content)
            if "function_call" in message:
                func_print = f"***** Suggested function Call: {message['function_call'].get('name', '(No function name found)')} *****"
                self.manager.add_message(func_print)
                self.manager.add_message("Arguments: ")
                self.manager.add_message(message["function_call"].get("arguments", "(No arguments found)"))
                self.manager.add_message("*" * len(func_print))
        self.manager.add_message("")
        self.manager.add_message("-" * 80)

    def get_human_input(self, prompt: str) -> str:
        print(prompt)
        reply = ""

        return reply


class AutoGenManager:
    cumulative_message = ""

    def __init__(self, if_show_reply=False):
        # read api key from config file
        global_openai_key = ConfigReader().get_property("openai_api_key")
        if global_openai_key is not None and global_openai_key != "":
            openai.api_key = global_openai_key
        self.__default_model = ConfigReader().get_property("openai_model")
        self.config_list = [{"model": self.__default_model, "api_key": openai.api_key}]
        self.if_show_reply = if_show_reply
        self.planner = None
        self.planner_user = None
        self.assistant = None
        self.user_proxy = None

    def run(self, requirement, relatived_code):
        self.construct_agents(relatived_code)
        self.user_proxy.initiate_chat(
            self.assistant,
            message=requirement,
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
            name=name,
            system_message=system_message,
            is_termination_msg=is_termination_msg,
            max_consecutive_auto_reply=max_consecutive_auto_reply,
            human_input_mode=human_input_mode,
            code_execution_config=code_execution_config,
            call_back=call_back,
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
                                        ):
        return SolidUserProxyAgent(
            name,
            system_message=system_message,
            is_termination_msg=is_termination_msg,
            max_consecutive_auto_reply=max_consecutive_auto_reply,
            human_input_mode=human_input_mode,
            function_map=function_map,
            code_execution_config=code_execution_config,
            llm_config=llm_config,
            default_auto_reply=default_auto_reply,
            )

    def construct_agents(self, relatived_code):
        self.planner = self.generate_default_planner()
        self.planner_user = self.generate_default_planner_user()
        self.assistant = self.generate_default_assistant(relatived_code)
        self.user_proxy = self.generate_default_user_proxy()
        self.planner.manager = self
        self.planner_user.manager = self
        self.assistant.manager = self
        self.user_proxy.manager = self
        return

    def add_message(self, *args):
        # Joining all arguments with a space after converting each to a string
        messages = ' '.join(map(str, args))
        self.cumulative_message += messages + "\n"

    def retrieve_message(self):
        msg = self.cumulative_message
        self.cumulative_message = ""
        return msg

    def generate_default_planner(self):
        # todo: update callback function
        planner = SolidAssistantAgent(
            name="Planner",
            llm_config={"config_list": self.config_list},
            # the default system message of the AssistantAgent is overwritten here
            system_message=DEFAULT_SYSTEM_MESSAGE)
        return planner

    def generate_default_planner_user(self):
        # todo: update callback function
        planner_user = SolidUserProxyAgent(
            name="Your_Proxy",
            max_consecutive_auto_reply=0,  # terminate without auto-reply
            human_input_mode="NEVER",
        )
        return planner_user

    def ask_planner(self, message):
        self.planner_user.initiate_chat(self.planner, message=message)
        self.planner_msg = self.planner_user.last_message()["content"]
        # return the last message received from the planner
        return self.planner_user.last_message()["content"]

    def generate_default_assistant(self, relatived_code: str):
        # todo: update callback function
        assistant = SolidAssistantAgent(
            name="SolidGPT",
            system_message=ASSISTANT_SYSTEM_MESSAGE + f"""Relatived code as follow: {relatived_code}""",
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
            name="Your_Proxy",
            human_input_mode="ALWAYS",
            max_consecutive_auto_reply=10,
            is_termination_msg=lambda x: "content" in x and x["content"] is not None and x["content"].rstrip().endswith(
                "TERMINATE"),
            code_execution_config={"work_dir": "planning"},
            function_map={"ask_planner": self.ask_planner},
        )
        return user_proxy

