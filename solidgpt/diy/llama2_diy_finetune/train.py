from transformers import TrainingArguments, pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
from trl import SFTTrainer
from peft import LoraConfig, PeftModel
from DataLoader import ModelDataLoader
from config import ModelSettings

class ModelTrainer:
    def __init__(self, model, tokenizer, train_dataset, valid_dataset, peft_config, max_seq_length, training_arguments, packing,  model_name):
        self.model = model
        self.tokenizer = tokenizer
        self.train_dataset = train_dataset
        self.valid_dataset = valid_dataset
        self.peft_config = peft_config
        self.max_seq_length = max_seq_length
        self.training_arguments = training_arguments
        self.packing = packing
        self.model_name = model_name

    def train_model(self):
        trainer = SFTTrainer(
            model=self.model,
            train_dataset=self.train_dataset,
            eval_dataset=self.valid_dataset,
            peft_config=self.peft_config,
            dataset_text_field="text",
            max_seq_length=self.max_seq_length,
            tokenizer=self.tokenizer,
            args=self.training_arguments,
            packing=self.packing,
        )
        trainer.train()
        trainer.model.save_pretrained(self.model_name)


def generate_system_message(prompt):

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
          {
            "role": "system",
            "content": "You will be given a high-level description of the model we are training, and from that, you will generate a simple system prompt for that model to use. Remember, you are not generating the system message for data generation -- you are generating the system message to use for inference. A good format to follow is `Given $INPUT_DATA, you will $WHAT_THE_MODEL_SHOULD_DO.`.\n\nMake it as complex as possible. Include nothing but the system prompt in your response.\n\nFor example, never write: `\"$SYSTEM_PROMPT_HERE\"`.\n\nIt should be like: `$SYSTEM_PROMPT_HERE`."
          },
          {
              "role": "user",
              "content": prompt.strip(),
          }
        ],
        temperature=0.5,
        max_tokens=16000,
    )

    return response.choices[0].message['content']


# Usage example
if __name__ == "__main__":
    
    prompt = "A model that takes in a function description and output the lowdefy yaml file to configures a website. The general lowdefy has a good indent. f{template}"
    model_type = "togethercomputer/LLaMA-2-7B-32K-Instruct"
    model_name_ = "llama-2-7b-lowdefy_Instruct"
    result_dir = "./result"
    model_path = "./llama2-7b-lowdefy_generator_saved"

    model_settings = ModelSettings(
        model_name=model_type,
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

    system_message = " The system message is: `Given a function description, you will generate the Lowdefy YAML file to configure a website. The generated YAML file should follow the general Lowdefy indentation format.`. Feel free to re-run this cell if you want a better result."

    train_dataset_path = "./dataset/train.jsonl"
    valid_dataset_path = "./dataset/test.jsonl"

    data_loader = ModelDataLoader(train_dataset_path, valid_dataset_path, system_message)
    train_dataset_mapped, valid_dataset_mapped = data_loader.load_and_preprocess_datasets()

    peft_config = LoraConfig(
        lora_alpha=64,
        lora_dropout=0.1,
        r=512,
        bias="none",
        task_type="CAUSAL_LM",
    )

    training_arguments = TrainingArguments(
        output_dir=result_dir,
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

    model_trainer = ModelTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_dataset_mapped,
        valid_dataset=valid_dataset_mapped,
        peft_config=peft_config,
        max_seq_length=None,  # Set your desired max sequence length
        training_arguments=training_arguments,
        packing=False,
        model_name=model_name_
    )
    model_trainer.train_model()

    base_model = AutoModelForCausalLM.from_pretrained(model_type, low_cpu_mem_usage=True, return_dict=True, torch_dtype=torch.float16, device_map={"":0})
    model = PeftModel.from_pretrained(base_model, model_name_)
    model = model.merge_and_unload()

    tokenizer = AutoTokenizer.from_pretrained(model_type, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "left"

#Save the params
    model.save_pretrained(model_path)
    tokenizer.save_pretrained(model_path)


