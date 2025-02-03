import openai
from solidgpt.src.configuration.configreader import ConfigReader
import agentops
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize AgentOps
agentops.init(os.getenv('AGENTOPS_API_KEY'))

class GPTManager:

    _instance = None

    @agentops.record_function('GPTManager_new')
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GPTManager, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance
    
    @agentops.record_function('GPTManager_init')
    def __init__(self, if_show_reply = False):
        # read api key from config file
        global_openai_key = ConfigReader().get_property("openai_api_key")
        if global_openai_key is not None and global_openai_key != "":
            openai.api_key = global_openai_key
        self.__default_model = ConfigReader().get_property("openai_model")
        self.gpt_models_container = {}
        self.if_show_reply = if_show_reply

    @agentops.record_function('GPTManager_create_model')
    def create_model(self, prompt, gpt_model_label, temperature=1.0, model = None):
        if model is None:
            model = self.__default_model
        gpt_model = GPTModel(prompt, self.__default_model, self.if_show_reply, temperature)
        self.gpt_models_container[gpt_model_label] = gpt_model
        return gpt_model
    
    @agentops.record_function('GPTManager_create_and_chat_with_model')
    def create_and_chat_with_model(self, prompt, gpt_model_label, input_message, temperature=0.1, model=None, is_stream = False):
        gpt_model = self.create_model(prompt, gpt_model_label, temperature, model)
        return gpt_model.chat_with_model(input_message, is_stream=is_stream)

    @agentops.record_function('GPTManager_get_gpt_model')
    def get_gpt_model(self, gpt_model_label):
        return self.completions_container[gpt_model_label]
    
    @agentops.record_function('GPTManager_remove_gpt_model')
    def remove_gpt_model(self, gpt_model_label):
        self.completions_container.pop(gpt_model_label)
    
class GPTModel:
    @agentops.record_function('GPTModel_init')
    def __init__(self, prompt, model, if_show_reply = True, temperature = 0.1):
        self.prompt = prompt
        self.model = model
        self.messages = [{"role": "system", "content": self.prompt}]
        self.last_reply = None
        self.if_show_reply = if_show_reply
        self.temperature = temperature

    @agentops.record_function('GPTModel_chat_with_model')
    def chat_with_model(self, input_message, is_stream=False):
        self.messages.append({"role": "user", "content": input_message})
        if not is_stream:
            self._run_model()
        else:
            return self._run_model_stream()
        return self.last_reply

    @agentops.record_function('GPTModel_run_model')
    def _run_model(self):
        chat = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            temperature=self.temperature,
        )
        reply = chat.choices[0].message.content
        if self.if_show_reply:
            print(f"ChatGPT: {reply}")
        self.messages.append({"role": "assistant", "content": reply})
        self.last_reply = reply

    @agentops.record_function('GPTModel_run_model_stream')
    def _run_model_stream(self):
        stream = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            temperature=self.temperature,
            stream=True,
        )
        return stream

    @agentops.record_function('GPTModel_add_background')
    def add_background(self, background_message):
        self.messages.append({"role": "assistant", "content": background_message})

# End of program
agentops.end_session('Success')