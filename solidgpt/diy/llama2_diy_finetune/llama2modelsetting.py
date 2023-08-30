import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
)

class LlamaBasicModelFactory:
    def __init__(self, model_name, lora_r, lora_alpha, lora_dropout, use_4bit, bnb_4bit_compute_dtype,
                 bnb_4bit_quant_type, use_nested_quant, device_map):
        self.model_name = model_name
        self.lora_r = lora_r
        self.lora_alpha = lora_alpha
        self.lora_dropout = lora_dropout
        self.use_4bit = use_4bit
        self.bnb_4bit_compute_dtype = bnb_4bit_compute_dtype
        self.bnb_4bit_quant_type = bnb_4bit_quant_type
        self.use_nested_quant = use_nested_quant
        self.device_map = device_map

    def create_model(self):
        compute_dtype = getattr(torch, self.bnb_4bit_compute_dtype)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=self.use_4bit,
            bnb_4bit_quant_type=self.bnb_4bit_quant_type,
            bnb_4bit_compute_dtype=compute_dtype,
            bnb_4bit_use_double_quant=self.use_nested_quant,
        )
        model = AutoModelForCausalLM.from_pretrained(
            self.model_name,
            quantization_config=bnb_config,
            device_map=self.device_map
        )
        model.config.use_cache = False
        model.config.pretraining_tp = 1
        tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "left"
        return model, tokenizer
