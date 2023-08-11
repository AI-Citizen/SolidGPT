import openai


class GPTManager:
    def __init__(self, if_show_reply=False):
        # read api key from config file
        openai.api_key = "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"
        self.gpt_models_container = {}
        self.if_show_reply = if_show_reply

    def create_model(self, model, prompt, gpt_model_label, temperature=1):
        gpt_model = GPTModel(prompt, model, self.if_show_reply, temperature)
        self.gpt_models_container[gpt_model_label] = gpt_model
        return gpt_model


class GPTModel:
    def __init__(self, prompt, model, if_show_reply=True, temperature=1):
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


gpt_manager = GPTManager()


def create_category_model():
    category_model = gpt_manager.create_model("gpt-3.5-turbo",
                                              "Suppose you are a software developer. Read this documentation page "
                                              "https://docs.lowdefy.com. You need to determine if the given prompt wants to"
                                              "1. create a block 2. create an action "
                                              "3. create a connection 4. create a requests. You should only answer in a "
                                              "single number",
                                              "category model")
    return

# block_model = gpt_manager.create_model("gpt-3.5-turbo",
#                                        "Suppose you are a lowdefy developer. Any yaml files you create will strickly follow lowdefy documentations."
#                                        "Read this documentation https://docs.lowdefy.com/block and follows the rules in this documentation exactly."
#                                        "You will only provide yaml files and do not need to provide explanations.",
#                                        "block model")

# model.add_background("Read this documentation page: https://docs.lowdefy.com/TextInput. "
#                      "You need to follow how yaml files are written on this page exactly.")

# print(block_model.chat_with_model("""
# ```
# blocks:
#     id: block_id
#     type: TextInput
#     properties:
#       label:
#         inline: true
# ```
# I want to make this text input block required."""))


summarize_model = gpt_manager.create_model("gpt-3.5-turbo",
                                       "Suppose you are a lowdefy developer."
                                       "Read this documentation https://docs.lowdefy.com/block and follows the rules in this documentation exactly."
                                       "You will summarize what will the yaml creates.",
                                       "block model")

print(summarize_model.chat_with_model("""
```
blocks:
    id: block_id
    type: TextInput
    required: true
    properties:
      label:
        inline: true
```
What does this yaml file create."""))
# This YAML file creates a block with the id "block_id" of type "TextInput". The block has a property called "label" with the inline property set to true. The property "label" is used to display a label for the TextInput block, and the "inline" property determines whether the label should be displayed inline with the input field or on a new line.

