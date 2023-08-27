from datasets import load_dataset

class ModelDataLoader:
    def __init__(self, train_dataset_path, valid_dataset_path, system_message):
        self.train_dataset_path = train_dataset_path
        self.valid_dataset_path = valid_dataset_path
        self.system_message = system_message

    def load_and_preprocess_datasets(self):
        train_dataset = load_dataset('json', data_files=self.train_dataset_path, split="train")
        valid_dataset = load_dataset('json', data_files=self.valid_dataset_path, split="train")

        train_dataset_mapped = train_dataset.map(lambda examples: {'text': [f'[INST] <<SYS>>\n{self.system_message.strip()}\n<</SYS>>\n\n' + prompt + ' [/INST] ' + response for prompt, response in zip(examples['prompt'], examples['completion'])]}, batched=True)
        valid_dataset_mapped = valid_dataset.map(lambda examples: {'text': [f'[INST] <<SYS>>\n{self.system_message.strip()}\n<</SYS>>\n\n' + prompt + ' [/INST] ' + response for prompt, response in zip(examples['prompt'], examples['completion'])]}, batched=True)

        return train_dataset_mapped, valid_dataset_mapped

