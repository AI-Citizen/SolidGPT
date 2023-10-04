![IMG_4502](https://github.com/AI-Citizen/SolidGPT/assets/39673228/347a6be2-93d6-42e9-99e2-f8b7b1ea96de)
<h1 align="center">🧱 SolidGPT-Technology Business Boosting Framework</h1>

<a href="docs/Introduction_CN.md"><img src="https://img.shields.io/badge/文档-中文版-blue.svg" alt="CN doc"></a>
[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)

# 🚀 What’s this
**V0.2.0:** Help you generate Product Requirement Document and Code Solution base on your private project with one line command.

# 🔥New Release: [SolidGPT Cloud Service](https://calm-flower-017281610.3.azurestaticapps.net/)
Just launched 🚀! Our Cloud Service lets you seamlessly integrate with your private backend. Design, tech, and PRD solutions for your project - all with a simple click! 
Get a personal AI for everyone! Boost your work like never before


### 🔥🔥 [Click to try SolidGPT Cloud Service!](https://calm-flower-017281610.3.azurestaticapps.net/)

>SolidGPT is a human-AI collaboration framework. Users can add private data and create their own agent workgraph using embedding finetuning and in-context learning simply with our framework. Our goal: empower AI to work with humans using tools to accomplish business tasks.

# 🏁 Quick Start

## 🧱 **Prerequisite**

- python3.8 or above
- [Openai api key](https://openai.com/blog/openai-api)

## 🔧 **Setup**
```sh
git clone https://github.com/AI-Citizen/SolidGPT.git
cd SolidGPT 
pip3 install -r requirements.txt #installing the env
```
- Input api keys at SolidGPT/solidgpt/src/configuration/Configuration.yaml

    - input your openai api token 

    - (optional)input your notion token and page id
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


## 🔥 **Run**


**Generate Technical Solution** - deeply integrate with your private project code to resolve your problem

```sh
cd quickstart
python3 start_solution.py -r "your requiremennt" -c "/your/code/file/path"
```


**Generate PRD** - deeply integrate with your private project inforamtion to generate the Product Requirement Document

***Default ouput path is SolidGPT/quickstart***

```sh
cd quickstart
python3 start_prd.py -r "your requiremennt" -a <your project background>(optional) -b </your/project/wiki/file/path>(optional)
```
### Samples
***Generate Technical Solutions Sample***
```sh

python3 start_solution.py -r "Help me integrate donate api with paypal api" -c /your/relateived/code/file/path
```
***Generate PRD Samples***
```sh

# No private data writing PRD
python3 start_prd.py -r "Help me write a blog plateform prd"
# Adding Private data into the consideration 
python3 start_prd.py -r "Adding donate feature to my blog" -b /my/project/wiki/file/path.md
python3 start_prd.py -r "Adding donate feature to my blog" -a "I am pleased to introduce our specialized U.S. stock blogging platform. This platform not only enables users to register and submit insightful articles but also allows readers to comment, share their trading perspectives, and keep abreast of breaking financial news. It has been thoughtfully designed to cultivate a robust exchange of ideas and information amongst financial enthusiasts."
python3 start_prd.py -r "Adding donate feature to my blog" -b /my/project/wiki/file/path.md -a "I am pleased to introduce our specialized U.S. stock blogging platform. This platform not only enables users to register and submit insightful articles but also allows readers to comment, share their trading perspectives, and keep abreast of breaking financial news. It has been thoughtfully designed to cultivate a robust exchange of ideas and information amongst financial enthusiasts."
```

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