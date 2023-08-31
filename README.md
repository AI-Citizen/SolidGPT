<h1 align="center">🧱 SolidGPT-Time to create your agent team</h1>
[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)
# 🚀 What’s this

SolidGPT is a human-AI collaboration platform. Users can add private data and tailor agent workflows using techniques like embedding finetuning. Our goal: empower AI to work with humans using tools to accomplish business tasks.

Currently, agents are optimized for software development using tools like Notion, Lowdefy, and more. From the inception of an idea to the documentation of software development, task division, and eventual task implementation - everything can either be automatically or semi-automatically accomplished within SolidGPT.

# 🏁 Quick Start

## **Prerequisite**

- python3.7 or above
- (Optional)[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)  - Required if you wish to utilize the SolidPortal
- [Docker](https://docs.docker.com/engine/install/)
- [Openai api key](https://openai.com/blog/openai-api)
- (Optional）[Notion](https://developers.notion.com/) - Create Notion api key and get the Notion page id wihch you want to use as the output AI content

## **Quick Setup**

- git clone the repo
- pip3 install -r requirements
- Input api keys at solidgpt/configuration/Configuration.yaml

    - input your openai api token 

    - (optional)input your notion token and page id

## **Run Demo**

```python
cd demo
python3 quickstart.py
```

### **Start Your Own Graph**
0. (Optional) Customize your own agent and skill [(learn more)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/customagentskill.md)
1. Create a graph using Solid Portal or a JSON file. [(learn more)](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/solidporta.md)
2. Create an entry point located in the solidgpt folder and input the workgraph json file path
```python
# your_file_name.py
from solidgpt.src.orchestration.orchestration import *
Initializer()
app = Orchestration()
app.add_graph("workspace/config/config_data.json", "default graph")
app.run_graph_with_name("default graph")
```
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

### Auto Alignement

Using few-shot learning and auto-generating principles based on user tasks can allow AI to always follow principles, resulting in a more stable and reliable LLM.

### Dynamic Agent Skill

Automatically generate the customized agent skills base on the key word. And make up user’s business agents team

## 🕸️ Solid Graph

### Customized workflow

People can build a agents graph, each agent will focus on the specific work and pass the work result to the user and other agents. User can review/edit/regenerate the agent output.

![solidportal](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/images/solidportalscreenshot.png)

### Visualized Build Graph UI

We also provide the UI let user build the solid Graph easier and quicker.

## 🏉 Human-AI Deep Colleberation

### Colleberate with AI

Agent-created content auto-syncs with Notion, enabling user reviews during the LLM workflow. Subsequent agents use the user-edited result. Users can also establish a fully automated agent workflow.

### Notion

Notion, powered by LLM, can assist users with quickly editing, improving, reviewing, sharing, and sending final content editions to the next LLM agent.

## 🖇️ Document
[Solid Portal](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/solidportal.md)

[Solid GPT Infrastructure](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/infrastructure.md)

[Fine-tuning with GPT3.5](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/gptfinetuning.md)

[Fine-tuning with Llama2](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/llama2finetuning.md)

[Deeply Customize Agent Skill](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/customagentskill.md)

## Contact
If you have any questions or feedback about our project, please don't hesitate to reach out to us. We greatly appreciate your suggestions!
- Email: aict@ai-citi.com
- GitHub Issues: For more technical inquiries, you can also create a new issue in our [GitHub repository](https://github.com/AI-Citizen/SolidGPT/issues).
We will respond to all questions within 2-3 business days.
