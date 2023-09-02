# Embedding Your Private Data(Beta)
SolidGPT can help you embedding your resource data eigher in runtime or in pre-runtime.

## Start
> Embedding in runtime can skip the first step.
1. Embedding
```sh
cd quickstart
python3 embedding_data.py data_label your_resource_data_file_path
```
You can also move all your resource data files to `localstorage/embedding/originalresources` folder and run `python3 embedding_data.py data_label` to embed all the resource data files in the folder.
There will generate two kinds of data, embedding resource data and divided resource data in the `localstorage/embedding/embeddedresources`, `localstorage/embedding/dividedresources` folder. 

> Embedding in runtime can start from here
1. Add the data label to the custom agent skill
```JSON
{
    "skill_name": "EmbeddingDataExampleSkill",
    "basic_description": "Write System High-Level Dev Design",
    "instruction": "Here is the output document strucuture\n1. Introduction\nScope:\nGoals:\n2. Components\n3. Service Workflow\n4. APIs in Detail\n5. Database Table Schema\n... [List other tables in the same fashion]\n5. Dataflow and Architecture\n```mermaid\n```",
    "qa_example": "",
    "principles": "List specific API desgin, List specific Database table design, Ouput in Markdown, Use Mermaid for Diagrams",
    "embedding_background_data_list": "data_label",  // Add the embedding data label here
    "model_name": "gpt-4",
    "input_method": "SkillIOParamCategory.PlainText",
    "output_method": "SkillIOParamCategory.PlainText"
}
```
1. Add the EmbeddingDataExampleSkill into the graph by SolidPortal, code, manually edit workgraph JSON file. [Learn more about buiding workgraph](https://github.com/AI-Citizen/SolidGPT/blob/main/Readme.md#start-your-own-graph)
1. Run the graph with the custom agent skill which includes the embedding data
```python
# your_file_name.py
from solidgpt.src.orchestration.orchestration import *
Initializer()
# Register your embedding data in to the runtime embedding manager
embedding_manager.add_embed_model("<your_data_label>", EmbeddingModelParameter(
    resource_name= "<your_data_label>",
    original_resources_folder_path= "<your_private_data_resource_path>",
    divided_resources_folder_path= "<your_divided_resource_folder_path>", # generated in step 1, default is PROJECT_ROOT/localstorage/embedding/dividedresources
    embedded_resources_folder_path= "<your_embedded_resource_folder_path>",  # generated in step 1, defau1t is PROJECT_ROOT/localstorage/embedding/embeddedresources
    has_embedded=True
))

app = Orchestration()
app.add_graph("your/graph/config_file.json", "default graph")  # You can add the EmbeddingDataExampleSkill into the work graph
app.run_graph_with_name("default graph")
```