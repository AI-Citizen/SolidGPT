import os
import json
import tiktoken
from solidgpt.src.manager.gptmanager import GPTModel  # Import GPTModel from the correct location
from solidgpt.src.configuration.configreader import ConfigReader

# Set your OpenAI API key here
openai.api_key = ConfigReader().get_property("openai_api_key")


MAX_TOKENS_LIMIT = 16000

class GenerateDataset:
    def __init__(self, model_name):
        self.model_name = model_name
        prompt = "Explain the content of a Lowdefy YAML file."  # Define the prompt
        self.gpt_model = GPTModel(prompt, model_name)

    def _num_tokens_from_string(self, string: str, encoding_name: str) -> int:
        encoding = tiktoken.encoding_for_model(encoding_name)
        num_tokens = len(encoding.encode(string))
        return num_tokens

    def get_files_with_filter(self, root_path: str, regex_filter: str) -> list:
        filtered_files = []
        for dirpath, dirnames, filenames in os.walk(root_path):
            for filename in filenames:
                if filename.lower().endswith(regex_filter.lower()):
                    filtered_files.append(os.path.join(dirpath, filename))
        return filtered_files

    def generate_dataset(self, files_list):
        dataset = []
        for file_path in files_list:
            with open(file_path, "r") as f:
                yaml_content = f.read()

            yaml_prompt = f"Explain the following lowdefy YAML file's content:\n{yaml_content}"
            try:
                yaml_prompt_tokens = self._num_tokens_from_string(yaml_prompt, self.model_name)
                if yaml_prompt_tokens <= MAX_TOKENS_LIMIT:
                    yaml_explanation = self.gpt_model.chat_with_model(yaml_prompt)
                    dataset.append({"prompt": yaml_explanation, "completion": yaml_content})
                else:
                    print(f"Skipping {file_path} as it exceeds the token limit.")
            except openai.error.OpenAIError as e:
                print(f"Error generating YAML explanation: {e}")
                continue
        return dataset

def main():
    model_name = "gpt-3.5-turbo-16k"  # Replace with your desired model name
    root_folder = input("Enter the root folder path containing sub-folders with YAML files: ")

    dataset_generator = GenerateDataset(model_name)

    yaml_files = dataset_generator.get_files_with_filter(root_folder, ".yaml")
    dataset = dataset_generator.generate_dataset(yaml_files)

    output_jsonl_file = os.path.join(root_folder, 'localstorage', 'train.jsonl')
    with open(output_jsonl_file, "w") as f:
        for item in dataset:
            json.dump(item, f)
            f.write("\n")

    print(f"Dataset saved to {output_jsonl_file}")

if __name__ == "__main__":
    main()

