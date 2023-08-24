import os
import openai
import json
import tiktoken

# Set your OpenAI API key here
openai.api_key = ''

MAX_TOKENS_LIMIT = 16000

class GPTModel:
    def __init__(self, model, temperature=0.5):
        self.model = model
        self.temperature = temperature
        self.messages = []
        self.last_reply = None

    def generate_completion(self, input_message):
        self.messages.append({"role": "user", "content": input_message})
        chat = openai.ChatCompletion.create(
            model=self.model,
            messages=self.messages,
            temperature=self.temperature,
        )
        reply = chat.choices[0].message.content
        self.messages.append({"role": "assistant", "content": reply})
        return reply

def read_file(file_path):
    with open(file_path, "r") as f:
        return f.read()

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    encoding = tiktoken.encoding_for_model(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def main():
    root_folder = "./lowdefy_raw_repo/lowdefy-example-survey/"

    files = os.listdir(root_folder)
    gpt_model = GPTModel("gpt-3.5-turbo-16k")

    combined_results = {}
    combined_results_readme = {}
    for file_name in files:
        if file_name.lower() == "readme.md":
            file_path = os.path.join(root_folder, file_name)
            readme_content = read_file(file_path)
            readme_prompt = f"Generate summary for README:\n{readme_content}"
            readme_summary = gpt_model.generate_completion(readme_prompt)
            combined_results_readme[file_name] = {
                "prompt": readme_prompt,
                "completion": readme_summary,
            }

    for file_name in files:
        if file_name.endswith(".yaml") and "README.md" in combined_results_readme:
            file_path = os.path.join(root_folder, file_name)
            yaml_content = read_file(file_path)

            readme_summary = combined_results_readme["README.md"]["completion"]

            yaml_prompt = f"Explain the following lowdefy YAML file's name :\n{file_name} function based on the readme and the annotation in the yaml :\n{readme_summary}\n\nYAML Content:\n{yaml_content}"
            try:
                yaml_prompt_tokens = num_tokens_from_string(yaml_prompt, "gpt-3.5-turbo-16k")
                if yaml_prompt_tokens <= MAX_TOKENS_LIMIT:
                    yaml_explanation = gpt_model.generate_completion(yaml_prompt)
                    combined_results[file_name] = {"prompt": yaml_explanation, "completion": yaml_content}
                else:
                    print(f"Skipping {file_name} as it exceeds the token limit.")
            except openai.error.OpenAIError as e:
                print(f"Error generating YAML explanation: {e}")
                continue

    # Save the combined results to a JSON file
    output_json_file = "output_combined_results.json"
    with open(output_json_file, "w") as f:
        json.dump(combined_results, f, indent=4)

    print(f"Combined results saved to {output_json_file}")

if __name__ == "__main__":
    main()

