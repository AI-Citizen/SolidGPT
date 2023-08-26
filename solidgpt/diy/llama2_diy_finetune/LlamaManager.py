from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

class LlamaManager:
    def __init__(self, model_path, template_path):
        with open(template_path, "r") as f:
            self.template = f.read()

        self.system_message = "`Given a function description, you will generate the Lowdefy YAML file to configure a website. The generated YAML file should follow the general Lowdefy indentation format.`. Feel free to re-run this cell if you want a better result."

        self.model = AutoModelForCausalLM.from_pretrained(model_path)
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.gen = pipeline('text-generation', model=self.model, tokenizer=self.tokenizer, max_length=2048)

    def generate_yaml(self, user_prompt=None):
        if user_prompt is None:
            user_prompt = self.template

        prompt = f"[INST] <<SYS>>\n{self.system_message}\n<</SYS>>\n\nWrite yaml file that generate website based on the f{user_prompt}. [/INST]"
        result = self.gen(prompt)
        return result[0]['generated_text']

# Usage example
if __name__ == "__main__":
    model_path = "./llama2-7b-lowdefy_generator_saved"
    template_path = "./dataset/template.yaml"

    inference_model = LlamaManager(model_path, template_path)

    user_input = input("Enter your custom prompt or press Enter to use the default template: ")

    generated_yaml = inference_model.generate_yaml(user_input)
    print(generated_yaml)

