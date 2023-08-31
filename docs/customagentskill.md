# Custom Agent Skill
You can customize agent skills in two ways:
- Custom with JSON file
- Auto generate with customized skill generator(Beta)

## Custom with JSON file
1. Create a agent skill JSON file
```JSON
{
    "skill_name": "Internal Engineer tools expert ",
    "basic_description": "Response the engineers' questions base on the knowledege I provide to you",
    "instruction": "First step you need to check all of the readme resources and internal wiki and then..",
    "qa_example": "Q: How to setup the SolidGPT project?\nA: You need to install the python3 and docker.....",
    "principles": "Alwayls follow the content which I provide to you; If you are not sure answer no; Give the code example if question related to the code",
    "embedding_background_data_list": "ReadmeEmbedding,WikiEmbedding",
    "model_name": "gpt-3.5-turbo-16k",
    "input_method": "SkillIOParamCategory.PlainText",
    "output_method": "SkillIOParamCategory.PlainText"
	}
```

  - **skill_name:** Input what agent skill you want to build
  - **basic_description:** Briefly describe the nature of the task (recommended under 100 words)
  - **instruction: **Furnish a comprehensive set of instructions for performing the task.
  - **(Optional)qa_example:** Present an illustrative example of input and corresponding output for this Skill.
  - **principles:** Offer some guiding principles for undertaking the task
  - **(Optional)embedding_background_data_list: **Proivde your embedding resource folder here. If you have multiple resource folders, list their paths here separated by commas. 
  - **(Optional)model_name: **Specify the OpenAI model to be used; you can input your fine-tuned model here.
  - **input_method/output_method: **Currently, only plain text input and output are supported; no need to modify
}

2. Save the Agent Skill JSON file as .json
3. Locate Agent Skill JSON file into the Project_ROOT/localstorage/customizedskilldefinition

## Auto generate
```python
from solidgpt.src.diy.custom.customskillgenerator import CustomSkillGenerator
from solidgpt.src.manager.initializer import Initializer
Initializer()
generator = CustomSkillGenerator()
generator.generate_custom_skill("Product Manager")
```
You only need to change the key word in the line 5 and generator will help you generate 5 Agent Skill definition JSON files.