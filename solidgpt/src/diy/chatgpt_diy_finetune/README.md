# GPT Finetune (Beta Version)

## About the project
The implementation the lastest of the gpt-3.5 fine tuning. This code allows you to fine-tune a GPT-3.5 model for a custom chatbot application using OpenAI's API. The fine-tuned model can then be used to generate responses based on input prompts. Follow the steps below to use the code for fine-tuning and checking your dataset compatibility.

## Prerequisites

Before you begin, make sure you have the following:

1. An OpenAI API key.
2. Python 3.x installed on your machine.

## Setup

1. Clone or download this repository to your local machine.

2. Install the required Python packages using the following command:
```sh
pip install -r requirements.txt
```


## Fine-Tuning Your Model

1. Prepare your training dataset in JSONL format. Each line should contain a JSON object with a `"prompt"` key representing the input prompt and a `"completion"` key containing the expected completion.

2. Open the `chatgpt_train.py` file and locate the `training_file_path` variable. Set its value to the path of your training dataset JSONL file.

3. Run the script using the following command:
```sh
python chatgpt_train.py
```

4. You will be prompted to enter the path to your training dataset JSONL file. Provide the correct path and press Enter.

5. The script will start the fine-tuning process on your specified GPT model. The status will be displayed as the fine-tuning progresses.

6. Once the fine-tuning is completed, the script will exit, and your fine-tuned model will be ready for use.

## Checking Dataset Compatibility

To ensure your training dataset is compatible with the fine-tuning process, you can use the `dataset_checker.py` script. This script checks if your dataset meets the required format for fine-tuning.

1. Open the `dataset_checker.py` file and locate the `training_file_path` variable. Set its value to the path of your training dataset JSONL file.

2. Run the script using the following command:
```sh
python dataset_checker.py
```


3. The script will check your dataset and provide feedback on whether it's compatible with the fine-tuning process.

## Notes

- This code uses asyncio to handle asynchronous operations. The `aiohttp` package is required for asynchronous HTTP requests.

- Ensure you have your OpenAI API key handy, as it will be used to authenticate API requests.

- Fine-tuning may take some time to complete depending on your dataset size and the model you choose.

- Remember to respect OpenAI's usage policies and guidelines when fine-tuning and deploying models.

Feel free to customize the script according to your needs and explore further functionalities provided by the OpenAI API.

