from datasets import load_dataset

class ModelDataLoader:
    def __init__(self, train_dataset_path, valid_dataset_path, system_message=None):
        self.train_dataset_path = train_dataset_path
        self.valid_dataset_path = valid_dataset_path
        self.system_message = system_message

    def load_and_preprocess_datasets(self):
        train_dataset = load_dataset('json', data_files=self.train_dataset_path, split="train")
        valid_dataset = load_dataset('json', data_files=self.valid_dataset_path, split="train")

# Define a default system message if not provided
        if self.system_message is None:
            self.system_message = "The system message is: `Given a function description, you will generate the Lowdefy YAML file to configure a website. The generated YAML file should follow the general Lowdefy indentation format.`. Feel free to re-run this cell if you want a better result."

        train_dataset_mapped = train_dataset.map(lambda examples: {'text': [f'[INST] <<SYS>>\n{self.system_message.strip()}\n<</SYS>>\n\n' + prompt + ' [/INST] ' + response for prompt, response in zip(examples['prompt'], examples['completion'])]}, batched=True)
        valid_dataset_mapped = valid_dataset.map(lambda examples: {'text': [f'[INST] <<SYS>>\n{self.system_message.strip()}\n<</SYS>>\n\n' + prompt + ' [/INST] ' + response for prompt, response in zip(examples['prompt'], examples['completion'])]}, batched=True)

        return train_dataset_mapped, valid_dataset_mapped

