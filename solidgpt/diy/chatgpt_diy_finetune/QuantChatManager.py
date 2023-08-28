import os
import openai

class ChatCompletion:
    def __init__(self, model_name, system_prompt, user_input):
        self.model_name = model_name
        self.system_prompt = system_prompt
        self.user_input = user_input

    def generate_response(self):
        completion = openai.ChatCompletion.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": self.user_input}
            ],
            max_tokens=4000
        )

        response = completion["choices"][0]["message"]["content"]
        return response

def main():
    openai.api_key = os.getenv("OPENAI_API_KEY")

    #model_name = "ft:gpt-3.5-turbo-0613:personal:quantchat:7rxjAWKd"
    system_prompt = "You are a helpful Quant developer. Assume you are a Quant Developer and an expert of PineScript v5. Can you provide a simple script?"
    user_input = "Hello!"

    chat_completer = ChatCompletion(model_name, system_prompt, user_input)
    response = chat_completer.generate_response()

    print(response)

if __name__ == "__main__":
    main()

