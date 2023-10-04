![IMG_4502](https://github.com/AI-Citizen/SolidGPT/assets/39673228/347a6be2-93d6-42e9-99e2-f8b7b1ea96de)
<h1 align="center">🧱 SolidGPT-技术业务推进框架</h1>

[![Twitter Follow](https://img.shields.io/twitter/follow/SolidGPT?style=social)](https://twitter.com/SolidGPT)

# 🚀 欢迎使用SolidGPT
**V0.2.0:** 用一行命令帮助您生成产品需求文档和基于您的私人项目的代码解决方案。

>SolidGPT 是一个人工智能合作框架。用户可以添加私有数据并使用我们的框架简单地通过嵌入式微调和上下文学习创建自己的代理工作图。我们的目标：使用工具赋予AI与人类合作完成业务任务的能力。

# 🔥新发布: [SolidGPT 云服务](https://calm-flower-017281610.3.azurestaticapps.net/)
刚刚上线🚀！我们的云服务让您与您的私有后台无缝整合。为您的项目设计、技术和PRD解决方案
为每个人/企业提供私人AI！让人们的工作效率前所未有的提升。


### 🔥🔥 [点击试用SolidGPT云服务!](https://calm-flower-017281610.3.azurestaticapps.net/)

# 🏁 快速开始

## 🧱 **前提条件**

- python3.8 或以上版本
- [Openai api key](https://openai.com/blog/openai-api)

## 🔧 **设置**
```sh
git clone https://github.com/AI-Citizen/SolidGPT.git
cd SolidGPT 
pip3 install -r requirements.txt # 安装环境
```
- 在 SolidGPT/solidgpt/src/configuration/Configuration.yaml 中输入 api 密钥

    - 输入您的 openai api 令牌 

    - （可选）输入您的 notion 令牌和页面 id
- 将项目根文件夹设置为 python 路径
  - Linux/Mac
      ```sh
      export PYTHONPATH=$PYTHONPATH:$(git rev-parse --show-toplevel)/
      ```
  - Windows

      用项目根目录的路径替换 path\to\directory 
      ```cmd
      set PYTHONPATH=path\to\directory
      ```

## 🔥 **运行**

**生成技术解决方案** - 深度结合您的代码提供技术解决方案

```sh
cd quickstart
python3 start_solution.py -r "你的需求" -c "/你的代码文件路径"
```

**生成产品需求文档** - 深度结合您的项目背景提供产品需求文档

```sh
cd quickstart
python3 start_prd.py -r "你的需求" -a <你的项目背景>(可选) -b </你的项目wiki文件路径>(可选)
```

***默认最终输出路径为quickstart文件夹***

### 示例
***生成技术解决方案示例***
```sh

python3 start_solution.py -r "帮我整合捐款 api 与 paypal api" -c /你的相关代码文件路径
```
***生成 PRD 示例***
```sh

# 没有私人数据写 PRD
python3 start_prd.py -r "帮我写一个博客平台 prd"
# 将私人数据纳入考虑 
python3 start_prd.py -r "在我的博客中添加捐赠功能" -b /my/project/wiki/file/path.md
python3 start_prd.py -r "在我的博客中添加捐赠功能" -a "我很高兴为您介绍我们的专门的美股博客平台。此平台不仅允许用户注册和提交有见地的文章，还允许读者评论、分享他们的交易观点并了解最新的财经新闻。它经过深思熟虑的设计，旨在培育金融爱好者之间的强烈的思想和信息交流。"
python3 start_prd.py -r "在我的博客中添加捐赠功能" -b /my/project/wiki/file/path.md -a "我很高兴为您介绍我们的专门的美股博客平台。此平台不仅允许用户注册和提交有见地的文章，还允许读者评论、分享他们的交易观点并了解最新的财经新闻。它经过深思熟虑的设计，旨在培育金融爱好者之间的强烈的思想和信息交流。"
```
## 🖇️ 文档
[探索 SolidGPT](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/READMEv1.md)

[Solid Portal](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/solidportal.md)

[Solid GPT 基础设施](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/infrastructure.md)

[深度自定义代理技能](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/customagentskill.md)

[与私人数据的嵌入](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/embeddingprivatedata.md)

[GPT3.5的微调](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/gptfinetuning.md)

[Llama2的微调](https://github.com/AI-Citizen/SolidGPT/blob/main/docs/llama2finetuning.md)

## 联系方式
如果您对我们的项目有任何问题或反馈，请随时与我们联系。我们非常欣赏您的建议！
- 邮箱: aict@ai-citi.com
- GitHub 问题: 对于更技术性的询问，您也可以在我们的[GitHub 仓库](https://github.com/AI-Citizen/SolidGPT/issues)中创建一个新问题。
我们会在2-3个工作日内回复所有问题。