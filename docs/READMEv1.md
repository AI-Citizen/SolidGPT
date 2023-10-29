![IMG_4502](https://github.com/AI-Citizen/SolidGPT/assets/39673228/347a6be2-93d6-42e9-99e2-f8b7b1ea96de)
<h1 align="center">🧱 SolidGPT-Human-AI collaboration framework</h1>

<a href="docs/Introduction_CN.md"><img src="https://img.shields.io/badge/文档-中文版-blue.svg" alt="CN doc"></a>
[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)

# 🚀 What’s this

SolidGPT is a human-AI collaboration framework. Users can add private data and create their own agent workgraph using embedding finetuning and in-context learning simply with our framework. Our goal: empower AI to work with humans using tools to accomplish business tasks.

Currently, our framework are optimized for software development using tools Notion, Lowdefy. From the inception of an idea to the documentation of software development, task division, and eventual task implementation - everything can either be automatically or semi-automatically accomplished within SolidGPT.

# 📺 Demo

https://github.com/AI-Citizen/SolidGPT/assets/39673228/3c547894-c34b-4117-b895-dfa55f3afe1e

(The video's playback speed has been accelerated)

# 🏁 Quick Start

## **Prerequisite**

- python3.8 or above
- (Optional)[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)  - Required if you wish to utilize the SolidPortal
- [pnpm](https://pnpm.io/installation) - Install pnpm and making activating Corepack `corepack enable`. This is required for Lowdefy webapp to run.
- [Openai api key](https://openai.com/blog/openai-api)
- (Optional）[Notion](https://developers.notion.com/) - Create Notion api key and get the Notion page id which you want to use as the output AI content.

## **Quick Setup**
```sh
git clone https://github.com/AI-Citizen/SolidGPT.git
cd SolidGPT 
pip3 install -r requirements.txt #installing the env
```
- Input api keys at SolidGPT/solidgpt/src/configuration/Configuration.yaml

    - input your openai api token 

    - (optional)input your notion token and page id
- Set project root folder as python path
  Linux/Mac
  ```sh
  export PYTHONPATH=$PYTHONPATH:$(git rev-parse --show-toplevel)/
  ```
  Windows
  Run in cmd
  ```cmd
  for /f %%i in ('git rev-parse --show-toplevel') do set PYTHONPATH=%PYTHONPATH%;%%i\
  ```
  or setup manually


## **Run Demo**
**Actual real start up project "AI Says" - stock analysis app dev workflow**
include the brainstorming, write product requirement, write high level design, create kanban.
```sh
cd quickstart
python3 creategraph.py system
python3 quickstart.py system
```

**webapp dev workflow**
-include the brainstorming, write product requirement, write high level design, create kanban, generate app code(beta test), run web app.
```sh
cd quickstart
python3 creategraph.py webapp
python3 quickstart.py webapp
```
>The default initial output path is set to `SolidGPT/localstorage/workspace/in`. As part of the Demo, we have included two idea inputs in this location.

>The default output path is set to `SolidGPT/localstorage/workspace/out/<time - e.g. 202009011234>`
## **Start Your Own Graph**
0. (Optional) Customize your own agent and skill [(Learn more)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/customagentskill.md)
1. Create a graph using Solid Portal. [(Learn more)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/solidportal.md).
   You can also create a graph json file by code. Please check `quickstart/creategraph.py`
1. Add your initial business idea into the input folder e.g. `SolidGPT/localstorage/workspace/in/your_initial_input_file.json`. Make sure the initial input folder path same with the graph first node input.param_path.
1. Create an entry point located in the solidgpt folder and input the workgraph json file path
```python
# your_file_name.py
from solidgpt.src.orchestration.orchestration import *
Initializer()
app = Orchestration()
app.add_graph("your/graph/config_file.json", "default graph")
app.run_graph_with_name("default graph")
```
You can check the `quickstart/quickstart.py` as example.
3. Run the code with python3 your_file_name.py


## ⁉️ What can this help with?

- Speed up the journey from idea to functioning app.
- Agents that are semi/fully automated run the specific business tasks with private data.
- Engage with QA/chatbots enhanced by private data.

# 🔥 Key Features

## Boost Software Product

Processes can be either fully or semi-automated with users interfacing through Notion. Agents ensure efficiency and quality in every step.

Three key agents are:

- **PM Agent**: Refines ideas into structured PRD documents. Users can collaborate and tweak outputs on Notion for maximum value.
- **PE Agent**: Creates high-level designs, splits them into tasks, and organizes them on a Notion Kanban board. Tasks are distributed between AI and human teams.
- **SDE Agent**: Train the Agent to harness the open-source project, Lowdefy. This approach highlights the value of smart tool integration.

![sopdiagram](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/images/sopdiagram.png)

## 🤖 Deep Customized Agent Skill

### Connect private dataset

easier use private data to make a QA bot or add LLM prompt to do  in-context-learning.

 provide the embedding and query the private data easily.

### Auto Alignment

Using few-shot learning and auto-generating principles based on user tasks can allow AI to always follow principles, resulting in a more stable and reliable LLM.

### Dynamic Agent Skill

Automatically generate the customized agent skills based on the key word. And make up user’s business agents team

## 🕸️ Solid Graph

### Customized workflow

People can build a agents graph, each agent will focus on the specific work and pass the work result to the user and other agents. User can review/edit/regenerate the agent output.

![solidportal](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/images/solidportalscreenshot.png)

### Visualized Build Graph UI

We also provide the UI let user build the solid Graph easier and quicker.

## 🏉 Human-AI Deep Collaboration

### Collaborate with AI

Agent-created content auto-syncs with Notion, enabling user reviews during the LLM workflow. Subsequent agents use the user-edited result. Users can also establish a fully automated agent workflow.

### Notion

Notion, powered by LLM, can assist users with quickly editing, improving, reviewing, sharing, and sending final content editions to the next LLM agent.

## 🖇️ Document
[Solid Portal](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/solidportal.md)

[Solid GPT Infrastructure](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/infrastructure.md)

[Deeply Customize Agent Skill](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/customagentskill.md)

[Embedding with private data](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/embeddingprivatedata.md)

[Fine-tuning with GPT3.5](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/gptfinetuning.md)

[Fine-tuning with Llama2](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/llama2finetuning.md)

## Contact
If you have any questions or feedback about our project, please don't hesitate to reach out to us. We greatly appreciate your suggestions!
- Email: aict@ai-citi.com
- GitHub Issues: For more technical inquiries, you can also create a new issue in our [GitHub repository](https://github.com/AI-Citizen/SolidGPT/issues).
We will respond to all questions within 2-3 business days.
