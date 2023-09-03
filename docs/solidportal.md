
# SolidPortal
Offer a UI tool to design a work graph and save it as a JSON file. SolidGPT can then load and execute the work graph from this JSON file.

# Quick Start

## Prerequisite
[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## Start SolidPortal
run `yarn install` in solidportal to install dependencies

run `yarn install` in SolidGPT root folder to install dependencies

run `yarn start` which will also open your browser

cd ..SolidGPT\solidportal\src and run `node uploadServer.js` to start file upload server on local, OR 
you can manually upload file into SolidGPT\solidportal\src\uploads for Add node with input functions.

### Using our Server(Beta Test)
If you don't want to run it on your local, we have host on our server. It is easier for you to test.
[SolidPortal](http://154.16.118.231:8080/)   http://154.16.118.231:8080/(Beta test)

‼️ Note: All user-customized skills will be visible on the server. However, you can only employ both the basic skill and any custom skill if you possess the corresponding custom skill definition JSON file, located in your `localstorage/customizedskilldefinition` directory.
Basic skills are 
- "Debug Code"
- "Write Code"
- "Write Product Requirement Documentation","Use Notion"
- "Write High Level Design", "Create Kanban Board"
- "Custom Skill"
- "Write lowdefy YAML"
- "Host and run web app"

# What is Work Graph
The Work Graph comprises multiple nodes, each representing an agent skill. Every node concentrates on a specific task and shares the results with both the user and other agents.
With SolidPortal, you can establish these nodes and interlink them to construct a cohesive Work Graph.
You can also directly edit the JSON file to create a Work Graph.

## Node Type
### Input Node
The Input node allows you to upload your file to a local server and forwards the file path to the subsequent node. This ensures the next node can access and process the file using its path.

### Skill Node
The Skill node performs tasks based on its designated skill type.
When creating a Skill node, two properties require selection:

1. Agent: The Agent feature is still under development. For now, select any agent, though we recommend choosing one that aligns well with the desired skill.
2. Skill: Ensure the skill's input type matches the output type of the preceding node and that its output type corresponds with the input type of the following node.

# How to Use
- Start the SolidPortal
- Create a input node and upload the input file(Ignore this step if you don't have input file)
- Create skill nodes and connect each other according to your business process
- Select nodes or connections use backspace to remove if you need
- Save the work graph as json file
- Load the json file in SolidGPT and run the graph
Sample code to load the graph and run the graph

```python
from solidgpt.src.orchestration.orchestration import *

app = Orchestration()
app.add_graph("your/work/graph/path.json", "default graph")
app.run_graph_with_name("default graph")
```

# Add Customize Skills Json Sample
	{
		    "skill_name": "Programming",
		    "basic_description": "The art of writing computer programs",
		    "instruction": "Write code to solve problems and create applications",
		    "qa_example": "Q: What is a variable?\nA: A variable is a named storage location...",
		    "principles": "Dive deep",
		    "embedding_background_data_list": "",
		    "model_name": "gpt-3.5-turbo-16k",
		    "input_method": "SkillIOParamCategory.PlainText",
		    "output_method": "SkillIOParamCategory.PlainText"
		}

# Output Json Sample
```JSON
[
  {
    "node_id": "2cad9739-28d1-492c-ba20-d9a862aa162a",        
    "manual_review_result": false,
    "agent": "Product Manager",
    "skill": "Write Product Requirement Documentation",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID"
      }
    ],
    "outputs": [
      {
        "id": "37a4adf8-6376-4d0c-adce-afabf10fd0a2"
      }
    ]
  },
  {
    "node_id": "f9678ebc-80cf-4d7b-9039-b0443ba3ea4b",
    "manual_review_result": false,
    "agent": "Principal Engineer",
    "skill": "Write High Level Design",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
        "load_from_output_id": "37a4adf8-6376-4d0c-adce-afabf10fd0a2"
      }
    ],
    "outputs": [
      {
        "id": "7ec0f82d-cdf4-4696-8e3e-a346240a77c5"
      }
    ]
  },
  {
    "node_id": "e8b84341-00d3-44cc-87af-d83c7eea9df6",
    "manual_review_result": false,
    "agent": "Principal Engineer",
    "skill": "Create Kanban Board",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
        "load_from_output_id": "7ec0f82d-cdf4-4696-8e3e-a346240a77c5"
      }
    ],
    "outputs": [
      {
        "id": "35ced86f-ee1b-4241-ba1c-9b86f44404a9"
      }
    ]
  },
  {
    "node_id": "b9c4ac08-b398-4cd6-933a-0cb70e52982f",
    "manual_review_result": false,
    "agent": "Software Developer",
    "skill": "Write lowdefy main page YAML",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
        "load_from_output_id": "35ced86f-ee1b-4241-ba1c-9b86f44404a9"
      }
    ],
    "outputs": [
      {
        "id": "34d9d6f3-04fb-47ca-bd20-f8e3bf5a19cd"
      }
    ]
  },
  {
    "node_id": "d5eea34d-755c-468a-8b65-6554c6422ec9",
    "manual_review_result": false,
    "agent": "Software Developer",
    "skill": "Write lowdefy subpage YAML",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
        "load_from_output_id": "34d9d6f3-04fb-47ca-bd20-f8e3bf5a19cd"
      }
    ],
    "outputs": [
      {
        "id": "a9ca9f38-7bc5-4afc-ada3-487033eed321"
      }
    ]
  },
  {
    "node_id": "9e0fd82c-8556-42f3-88cc-3fbb825746c9",
    "manual_review_result": false,
    "agent": "Software Developer",
    "skill": "Host and run web app",
    "inputs": [
      {
        "param_path": "",
        "loading_method": "SkillInputLoadingMethod.LOAD_FROM_OUTPUT_ID",
        "load_from_output_id": "a9ca9f38-7bc5-4afc-ada3-487033eed321"
      }
    ],
    "outputs": [
      {
        "id": "bf53ddf6-ff7d-48ba-8407-48f7a8eda58b"
      }
    ]
  }
]
```
