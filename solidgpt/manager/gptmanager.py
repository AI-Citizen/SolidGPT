import openai
from solidgpt.configuration.configreader import ConfigReader

class GPTManager:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GPTManager, cls).__new__(cls)
            # You can initialize the instance attributes here
        return cls._instance
    
    def __init__(self, if_show_reply = True):
        # read api key from config file
        openai.api_key = ConfigReader().get_property("openai_api_key")
        self.gpt_models_container = {}
        self.if_show_reply = if_show_reply

    def create_model(self, model, prompt, gpt_model_label, temperature = 1):
        gpt_model = GPTModel(prompt, model, self.if_show_reply, temperature)
        self.gpt_models_container[gpt_model_label] = gpt_model
        return gpt_model
    
    def create_and_chat_with_model(self, model, prompt, gpt_model_label, input_message, temperature = 0.1):
        gpt_model = self.create_model(model, prompt, gpt_model_label, temperature)
        return gpt_model.chat_with_model(input_message)

    def get_gpt_model(self, gpt_model_label):
        return self.completions_container[gpt_model_label]
    
    def remove_gpt_model(self, gpt_model_label):
        self.completions_container.pop(gpt_model_label)
    
class GPTModel:
    def __init__(self, prompt, model, if_show_reply = True, temperature = 0.1):
        self.prompt = prompt
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

    def add_background(self, background_message):
        self.messages.append({"role": "assistant", "content": background_message})