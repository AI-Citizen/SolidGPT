![IMG_4502](https://github.com/AI-Citizen/SolidGPT/assets/39673228/347a6be2-93d6-42e9-99e2-f8b7b1ea96de)
<h1 align="center">🧱 SolidGPT-Technology Business Boosting Framework</h1>

<a href="docs/Introduction_CN.md"><img src="https://img.shields.io/badge/文档-中文版-blue.svg" alt="CN doc"></a>
[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)

# 🚀 What’s this
Help you generate Product Requirement Document and Code Solution base on your private code repository.

**V0.2.5:** Enable users to host the whole features of SolidGPT service locally while ensuring data privacy.

### 📺 Demo
![copy_FD8819CE-0A56-4E9C-A018-FA90700E7605](https://github.com/AI-Citizen/SolidGPT/assets/39673228/8ef57ba1-093e-4cc5-a07d-45b5c2dea850)

### 🔥🔥 [Click to try official host SolidGPT](https://calm-flower-017281610.3.azurestaticapps.net/)

If you like our work, please give us a 🌟 star. Your support serves as a great encouragement for us. Thank you! 😊


# 🏁 Quick Start

## 🧱 **Prerequisite**

- python3.8 or above
- [OpenAI api key](https://openai.com/blog/openai-api)
- [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## 🔧 **Setup**
```sh
git clone https://github.com/AI-Citizen/SolidGPT.git
cd SolidGPT 
pip3 install -r requirements.txt #installing the env
```
- Set project root folder as python path
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
    cd to the project root folder(SolidGPT)
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
    - Docker
        ```sh
        docker buildx build -t solidgptlocalhost .
        docker run -p 8000:8000 solidgptlocalhost
        ```
- ### Start UI portal
  - You'll need to install npm, and we recommend using version 9.8.1 or higher.

    ```sh
    # From the project root folder
    cd solidportal/panel  
    npm i && npm start
    ```



# 🏠 Introduction
- SolidGPT first learns from your repository in the `Onboard Project` phase. 

- After this, choose Generate PRD or Get Tech Solution for customized solutions based on the onboarded project.

## 📖 Onborading your project

1. Choose `Onboard Project` from the top left dropdown.
1. Enter your OpenAI API key.
1. Upload your project folder.（All files will be save in your localstorage `SolidGPT/localstorage/...`）
1. ❗️Note: After completing the Onboard Project, an Onboard ID will be generated. If you remain in the same browser session, it will be automatically applied to subsequent actions. Alternatively, you can save it and manually input it in the future to bypass onboarding.

## 🧮 Get Technical Solution
1. Choose `Get Tech Solution` from the top left dropdown.
1. Enter your OpenAI API key.
1. Input your problem/Requirement.

Note: We currently support Python, JavaScript, and TypeScript projects. Support for more languages is on the way.
## 📁 Generate Product Requirement Document
1. Choose `Generate RPD` from the top left dropdown.
1. input your requirement (suggest short and clear)
1. input additional info or your project, SolidGPT will use both summary from repository and additional info you provided (optinoal)


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
