from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers import pipeline

with open("./template.yaml", "r") as f:
    tmps = f.read()

system_message = "`Given a function description, you will generate the Lowdefy YAML file to configure a website. The generated YAML file should follow the general Lowdefy indentation format.`. Feel free to re-run this cell if you want a better result. "

model_path = "./llama2-7b-lowdefy_generator_saved"

model = AutoModelForCausalLM.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

prompt = f"[INST] <<SYS>>\n{system_message}\n<</SYS>>\n\nWrite yaml file that generate website based on the f{tmps}. [/INST]"
gen = pipeline('text-generation', model=model, tokenizer=tokenizer, max_length=2048)
result = gen(prompt)
print(result[0]['generated_text'])
