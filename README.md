![IMG_4502](https://github.com/AI-Citizen/SolidGPT/assets/39673228/347a6be2-93d6-42e9-99e2-f8b7b1ea96de)
<h1 align="center">🧱 SolidGPT-Build Your Service with AI</h1>

[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)

# 🚀 SolidGPT(SaaS edition)
SolidGPT(SaaS edition) is an AI-centric serverless platform. Combine AI coding and AI cloud infrastructure management. You can easily build, launch and scaleing services on AWS using natural language with LLM Agents.

## 📖 Highlight
- AI create APIs on AWS with one line input.
<img width="760" alt="Screen Shot 2024-02-04 at 2 59 44 PM" src="https://github.com/AI-Citizen/SolidGPT/assets/39673228/e72f3280-415f-4ac1-9496-812ac67a5153">

Incomming..

# SolidGPT
Chat everything with your code repository, ask repository-level code questions, and discuss your requirements. AI scans and learns from your code to seek coding advice, develop coding plans, and generate a product requirement documents using the information in the repository.

**If you like our work, please give us a 🌟 star. Your support serves as a great encouragement for us. Thank you! 😊**

# 🏁 Quick Start

## 🧱 **Prerequisite**

- python3.8 or above
- [OpenAI api key](https://openai.com/blog/openai-api)
- [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Install & run redis](https://redis.io/docs/install/install-redis/)
## 🔧 **Setup**
```sh
git clone https://github.com/AI-Citizen/SolidGPT.git
cd SolidGPT 
pip3 install -r requirements.txt #installing the env
```
- Set the project root folder as python path
  - Linux/Mac
      ```sh
      export PYTHONPATH=$PYTHONPATH:$(git rev-parse --show-toplevel)/
      ```
  - Windows

      Replace path\to\directory with the path of the project root directory
      ```cmd
      set PYTHONPATH=path\to\directory
      ```
- ### Start Server
    Open first terminal and cd into the project root folder(SolidGPT)
    - Linux/Mac/WSL2
      ```sh
      sh StartServer.sh
      ```
    - Windows

        Install the [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) and start the server from WSL2
        ```sh
        wsl --install
        wsl2
        sh StartServer.sh
        ```
        
        Or install directly on Windows [Not Recommended]
        
        Note: redis server needs to be installed before running below commands:
        https://github.com/microsoftarchive/redis/releases
        ```
        uvicorn solidgpt.src.api.api:app --reload

        celery -A solidgpt.src.api.celery_tasks worker --loglevel=info -P eventlet
        ```
    - Docker
        ```sh
        docker buildx build -t solidgptlocalhost .
        docker run -p 8000:8000 solidgptlocalhost
        ```
- ### Start UI portal
	Open the second terminal
  - You'll need to install npm, and we recommend using version 9.8.1 or higher.

    ```sh
    # From the project root folder
    cd solidportal/panel  
    npm i && npm start
    ```



# 🏠 Introduction
- SolidGPT first learns from your repository in the `Onboard Project` phase. 

- After this, choose Generate PRD or Get Tech Solution for customized solutions based on the onboarded project.

## 📖 Onboarding your project

1. Choose `Onboard Project` from the top left dropdown.
1. Enter your OpenAI API key.
1. Upload your project folder.（All files will be saved in your localstorage `SolidGPT/localstorage/...`）
1. ❗️Note: After completing the Onboard Project, an Onboard ID will be generated. If you remain in the same browser session, it will be automatically applied to subsequent actions. Alternatively, you can save it and manually input it in the future to bypass onboarding.

## 🧮 Get Technical Solution
1. Choose `Get Tech Solution` from the top left dropdown.
1. Enter your OpenAI API key.
1. Input your problem/Requirement.

Note: We currently support Python, JavaScript, and TypeScript projects. Support for more languages is on the way.
## 📁 Generate Product Requirement Document
1. Choose `Generate RPD` from the top left dropdown.
1. Input your requirement (suggest short and clear)
1. Input additional info or your project, SolidGPT will both use a summary from the repository and additional info you provide (optional)

### 📺 Demo(v0.2.5)
![copy_FD8819CE-0A56-4E9C-A018-FA90700E7605](https://github.com/AI-Citizen/SolidGPT/assets/39673228/8ef57ba1-093e-4cc5-a07d-45b5c2dea850)

## 🖇️ Document
[Explore SolidGPT](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/READMEv1.md)

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
