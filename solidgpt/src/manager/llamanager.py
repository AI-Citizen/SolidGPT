import os
from solidgpt.src.configuration.configreader import ConfigReader
from text_generation import Client
from solidgpt.src.manager.promptresource import llama_v2_prompt

class LLAManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LLAManager, cls).__new__(cls)
        return cls._instance

    def __init__(self, if_show_reply=False):
        self.llama2_base_url = ConfigReader().get_property("HF_API_LLAMA2_BASE")
        self.llama2_api_key = ConfigReader().get_property("HF_API_KEY")
        self.llama_models_container = {}
        self.if_show_reply = if_show_reply

    def create_model(self, prompt, llama_api, llama_model_label, temperature=1, model=None):
        if model is None:
            model = self.llama2_base_url  # Use LLAMA2 base URL as the model
        llama_model = LLamaModel(prompt, self.llama2_api_key,  self.llama2_base_url, self.if_show_reply, temperature)
        self.llama_models_container[llama_model_label] = llama_model
        return llama_model

    def create_and_chat_with_model(self, prompt, llama_model_label, input_message, temperature=0.1, model=None):
        llama_model = self.create_model(prompt, llama_model_label, temperature, model)
        return llama_model.chat_with_model(input_message)

    def get_llama_model(self, llama_model_label):
        return self.llama_models_container.get(llama_model_label)

    def remove_llama_model(self, llama_model_label):
        self.llama_models_container.pop(llama_model_label, None)

class LLamaModel:
    def __init__(self, prompt, api, model, if_show_reply=True, temperature=0.1):
        self.prompt = prompt
        self.api = api
        self.model = model
        self.messages = [{"role": "system", "content": self.prompt}]
        self.last_reply = None
        self.if_show_reply = if_show_reply
        self.temperature = temperature

    def chat_with_model(self, input_message):
        self.messages.append({"role": "user", "content": input_message})
        self._run_model()
        return self.last_reply

    def _run_model(self):
        client = Client(self.model, headers={"Authorization": f"Bearer {self.api}"}, timeout=120)
        chat = client.generate(
            llama_v2_prompt(self.messages),  # Convert messages to LLAMA2 prompt
            temperature=self.temperature,
            max_new_tokens=1000
        )
        reply = chat.generated_text
        if self.if_show_reply:
            print(f"LLAMA2: {reply}")
        self.messages.append({"role": "assistant", "content": reply})
        self.last_reply = reply

    def add_background(self, background_message):
        self.messages.append({"role": "assistant", "content": background_message})

