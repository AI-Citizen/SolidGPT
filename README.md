# 🧱 SolidGPT

# ❗️❗️We solemnly declare:

**We have NOT issued any cryptocurrency.**

**Any cryptocurrency claiming to be issued in our name is a SCAM. Please stay vigilant and avoid being deceived.**


# 🚀 What's this
SolidGPT is a AI searching assistant for developer that helps code and workspace semantic search

🔥🔥🔥 Try SolidGPT VSCode Extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=aict.solidgpt)

Appreciate Star 🌟 us on our [SolidGPT Github](https://github.com/AI-Citizen/SolidGPT)

# Try SolidGPT VSCode Extension
1. Install SolidGPT VSCode Extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=aict.solidgpt)

# 🏁 Quick Start
Highly recommend to try SolidGPT VSCode Extension from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=aict.solidgpt).

Or you can follow the steps below to build from source. 
## 📦 Build From Source
1. Pull the latest version of the SolidGPT from the GitHub repository.
1. Pip install the requirements.txt file under the SolidGPT root directory. 
```sh
pip install -r requirements.txt
```
1. Open terminal and run the following command to start the server.
```sh
python run_api.py
```
1. Open terminal and run the following command to start the webapp.
```sh
cd solidportal
npm install
npm run dev
```

## ❗️❗️ Onborading your Codebase and Notion
1. Click Settings button on the right bottom corner.
<img width="124" alt="image" src="https://github.com/AI-Citizen/SolidGPT-Private/assets/39673228/451b52e3-4f79-478f-9ee9-5679a93a1656">


 ### 1. Setup Codebase
1. Enter your OpenAI API key. [Get OpenAI API Key](https://openai.com/blog/openai-api)
1. Enter the full path of the folder you wish to onboard. **Suggest onboard lower than 100 files, maximum support 500 files onboarding**. 
<img width="315" alt="image" src="https://github.com/AI-Citizen/SolidGPT-Private/assets/39673228/62f1790a-196a-4088-a747-e91205e8fc32">

 ### 2. Setup Notion (Optional)
1. Configure the Notion API by getting your Notion API secret from [Notion API](https://developers.notion.com/docs/create-a-notion-integration#getting-started) and entering it on the Settings page
1. Give your integration page permissions. [Details](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)
1. Get Notion Page ID and entering it on the Settings page
<img width="669" alt="image" src="https://github.com/AI-Citizen/SolidGPT-Private/assets/39673228/ae2b5ab3-af61-44e7-bdc1-d81a33462d23">
<img width="315" alt="image" src="https://github.com/AI-Citizen/SolidGPT-Private/assets/39673228/6e96db5b-350a-4e8b-b9ca-b41ccfe6ce7c">

 ### 3. Pick chat resources and start chat

### Public web research

Enter an OpenAI API key in Settings, then use either command in chat:

* `/web Python asyncio TaskGroup documentation` searches the public web.
* `/fetch https://docs.python.org/3/library/asyncio-task.html` reads one public page.

These commands use [Parallel Search MCP](https://docs.parallel.ai/integrations/mcp/search-mcp)
with no Parallel account or API key. Anonymous search uses Fast mode. The public
sources are passed to your configured OpenAI model to produce an answer with source
links. Your existing OpenAI API key is still required for that answer; indexing a
codebase or Notion workspace is unnecessary.

Only the explicit query or URL is sent to Parallel. Selected files, codebase and
Notion content are not included. Other chat messages keep using the selected local
resources. Do not put secrets in public research commands. New chat/reset starts a
new research session; related search and fetch commands reuse the current session.
Public research does not include earlier chat messages in model prompts.

The server uses Parallel when `SOLIDGPT_WEB_SEARCH_PROVIDER` is unset. Set it to
`disabled` before starting the server to disable public research. An unsupported
explicit provider value returns an error rather than falling back. Requests have
timeouts and surface service errors, including free-tier rate limits.

To run the focused tests with the existing Python dependencies installed (Node.js
22 or newer for the component tests):

```sh
pip install -r requirements-test.txt
python -m unittest discover -s tests -p 'test_webresearch.py'
cd solidportal
npm ci
npm run test:research
```


## 🔥 Usecase
- Talk to your codebase, save time hunting for the place to start a change or the right method to call.
- Ask any questions about your codebase, get the answer in seconds.
- Semantic search and summary in Notion, knows your project from documents and track the project sprint board and tickets.
- Get questions answered from your codebase and Notion, no more context switching.

## 📖 Known Issue
1. [Intel Chip Mac]: permission denied 
    - Please run \`cd ~/.vscode/extensions\` and \`chmod -R 777 aict.solidgpt*\` in your terminal to allow the app to run.

## 📣 Feedback!!
If you have any questions or feedback about our project, please don't hesitate to reach out to us. We greatly appreciate your suggestions!
- Email: aict@ai-citi.com
- GitHub Issues: For more technical inquiries, you can also create a new issue in our [GitHub repository](https://github.com/AI-Citizen/SolidGPT/issues).
We will respond to all questions within 2-3 business days.

## Data Safety
- SolidGPT will not collect any of users' data.
- SolidGPT using OpenAI series model API, using SolidGPT indicates that you have read, understood, and agreed to adhere to all terms of use associated with the OpenAI GPT series model API.
