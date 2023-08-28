import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")

completion = openai.ChatCompletion.create(
    model="ft:gpt-3.5-turbo-0613:personal:quantchat:7rxjAWKd",
  messages=[
    {"role": "system", "content": "You are a helpful quat developer. Assume you are Quant Developer and the expert of PineScript v5. Can you provide a simple scripts"},
    {"role": "user", "content": "Hello!"}
  ], max_tokens=4000
)

print(completion["choices"][0]["message"]["content"])
