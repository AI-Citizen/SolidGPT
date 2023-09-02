# Custom Agent Skill
You can customize agent skills in two ways:
- Custom with JSON file
- Auto generate with customized skill generator(Beta)

## Custom with JSON file
1. Create a agent skill JSON file
```JSON
{
    "skill_name": "WrteSystemDesign",
    "basic_description": "Write System High-Level Dev Design",
    "instruction": "Here is the output document strucuture\n1. Introduction\nScope:\nGoals:\n2. Components\n3. Service Workflow\n4. APIs in Detail\n5. Database Table Schema\n... [List other tables in the same fashion]\n5. Dataflow and Architecture\n```mermaid\n```",
    "qa_example": "",
    "principles": "List specific API desgin, List specific Database table design, Ouput in Markdown, Use Mermaid for Diagrams",
    "embedding_background_data_list": "",
    "model_name": "gpt-4",
    "input_method": "SkillIOParamCategory.PlainText",
    "output_method": "SkillIOParamCategory.PlainText"
}
```

  - **skill_name:** Input what agent skill you want to build
  - **basic_description:** Briefly describe the nature of the task (recommended under 100 words)
  - **instruction:** Furnish a comprehensive set of instructions for performing the task.
  - **(Optional)qa_example:** Present an illustrative example of input and corresponding output for this Skill.
  - **(Optional)principles:** Offer some guiding principles for undertaking the task
  - **(Optional)embedding_background_data_list:** Proivde your embedding resource folder here. If you have multiple resource folders, list their paths here separated by commas. [Learn more about embedding private data](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/embeddingprivatedata.md)
  - **(Optional)model_name:** Specify the OpenAI model to be used; you can input your fine-tuned model here.
  - **input_method/output_method:** Currently, only plain text input and output are supported; no need to modify
}

2. Save the Agent Skill JSON file as .json
3. Locate Agent Skill JSON file into the Project_ROOT/localstorage/customizedskilldefinition

## Auto Generate(Beta)
```python
from solidgpt.src.diy.custom.customskillgenerator import CustomSkillGenerator
from solidgpt.src.manager.initializer import Initializer
Initializer()
generator = CustomSkillGenerator()
generator.generate_custom_skill("Product Manager")
```
You only need to change the key word in the line 5 and generator will help you generate 5 Agent Skill definition JSON files.
