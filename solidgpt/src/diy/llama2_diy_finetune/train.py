from transformers import TrainingArguments, pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
from llamamanager import LlamaManager
from trl import SFTTrainer
from peft import LoraConfig, PeftModel
from dataloader import ModelDataLoader
from llama2modelsetting import LlamaBasicModelFactory

class Llama2TrainerParam:
    def __init__(self, model, tokenizer, train_dataset, valid_dataset, peft_config, max_seq_length, training_arguments, packing, model_name):
        self.model = model
        self.tokenizer = tokenizer
        self.train_dataset = train_dataset
        self.valid_dataset = valid_dataset
        self.peft_config = peft_config
        self.max_seq_length = max_seq_length
        self.training_arguments = training_arguments
        self.packing = packing
        self.model_name = model_name

class LLamaModel:
    def __init__(self, model_type="togethercomputer/LLaMA-2-7B-32K-Instruct",
                 model_name="llama-2-7b-lowdefy_Instruct",
                 result_dir="./result",
                 model_path='./llama2-7b-lowdefy_generator_saved',
                 train_dataset_path="./dataset/train.jsonl",
                 valid_dataset_path="./dataset/test.jsonl"):
        self.model_type = model_type
        self.model_name_ = model_name
        self.result_dir = result_dir
        self.model_path = model_path
        self.train_dataset_path = train_dataset_path
        self.valid_dataset_path = valid_dataset_path
        self.train_param = None

    def set_train_config(self, train_param: Llama2TrainerParam):
        self.train_param = train_param

    def __set_default_config(self):
        train, valid = self.__load_train_dataset()
        model_settings = LlamaBasicModelFactory(
            model_name=self.model_type,
            lora_r=512,
            lora_alpha=64,
            lora_dropout=0.1,
            use_4bit=True,
            bnb_4bit_compute_dtype="float16",
            bnb_4bit_quant_type="nf4",
            use_nested_quant=False,
            device_map={"": 0}
        )
        model, tokenizer = model_settings.create_model()
        peft_config = LoraConfig(
            lora_alpha=64,
            lora_dropout=0.1,
            r=512,
            bias="none",
            task_type="CAUSAL_LM",
        )
        training_arguments = TrainingArguments(
            output_dir=self.result_dir,
            num_train_epochs=1,
            per_device_train_batch_size=8,
            gradient_accumulation_steps=1,
            optim="paged_adamw_32bit",
            save_steps=25,
            logging_steps=5,
            learning_rate=1e-3,
            weight_decay=0.001,
            fp16=False,
            bf16=False,
            max_grad_norm=0.3,
            max_steps=-1,
            warmup_ratio=0.03,
            group_by_length=True,
            lr_scheduler_type="constant",
            report_to="all",
            evaluation_strategy="steps",
            eval_steps=5
        )
        return Llama2TrainerParam(
            model=model,
            tokenizer=tokenizer,
            train_dataset=train,
            valid_dataset=valid,
            peft_config=peft_config,
            max_seq_length=None,  # Set your desired max sequence length
            training_arguments=training_arguments,
            packing=False,
            model_name=self.model_name_
        )

    def __load_train_dataset(self):
        data_loader = ModelDataLoader(self.train_dataset_path, self.valid_dataset_path)
        train_dataset_mapped, valid_dataset_mapped = data_loader.load_and_preprocess_datasets()
        return train_dataset_mapped, valid_dataset_mapped

    def train_model(self):
        if self.train_param is None:
            self.train_param = self.__set_default_config()

        trainer = SFTTrainer(
            model=self.train_param.model,
            train_dataset=self.train_param.train_dataset,
            eval_dataset=self.train_param.valid_dataset,
            peft_config=self.train_param.peft_config,
            dataset_text_field="text",
            max_seq_length=self.train_param.max_seq_length,
            tokenizer=self.train_param.tokenizer,
            args=self.train_param.training_arguments,
            packing=self.train_param.packing,
        )

        trainer.train()
        trainer.model.save_pretrained(self.model_name_)
        self.__save_model()

    def __save_model(self):
        base_model = AutoModelForCausalLM.from_pretrained(self.model_type, low_cpu_mem_usage=True, return_dict=True, torch_dtype=torch.float16, device_map={"":0})
        model = PeftModel.from_pretrained(base_model, self.model_name_)
        model = model.merge_and_unload()
        tokenizer = AutoTokenizer.from_pretrained(self.model_type, trust_remote_code=True)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "left"
        model.save_pretrained(self.model_path)
        tokenizer.save_pretrained(self.model_path)

    def predict(self, prompt, template_path=None):
        if self.train_param is None:
            self.train_param = self.__set_default_config()

        user_prompt = self.template + "\n" + prompt
        llama_manager = LlamaManager(model_path=self.model_path, template_path=template_path)
        generated_yaml = llama_manager.generate_yaml(user_prompt)
        return generated_yaml

# Usage example
if __name__ == "__main__":
    llama_model = LLamaModel()
    llama_model.train_model()

    prompt = "help me create lowdefy file for personal website"
    user_template_path = "./dataset/template.yaml"
    generated_yaml = llama_model.predict(prompt, template_path=user_template_path)
    print("Generated YAML:\n", generated_yaml)
