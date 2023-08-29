import openai
import time
import logging
from solidgpt.configuration.configreader import ConfigReader

class GPTFinetune:
    def __init__(self, training_file_id, model_name, suffix_name):
        self.training_file_id = training_file_id
        self.model_name = model_name
        self.suffix_name = suffix_name
        self.job_id = None
        self.poll_interval = 60

        openai.api_key = ConfigReader().get_property("openai_api_key")

    def start_fine_tuning(self):
        model_details = openai.FineTuningJob.create(
            training_file=self.training_file_id,
            model=self.model_name,
            suffix=self.suffix_name
        )
        self.job_id = model_details["id"]
        logging.info("Fine-tuning job started: %s", self.job_id)
        return self.job_id

def upload_training_file(training_file_path):
    training_response = openai.File.create(
        file=open(training_file_path, "rb"), purpose="fine-tune"
    )
    training_file_id = training_response["id"]
    while training_file_id is None:
        logging.info("Waiting for training file ID...")
        time.sleep(30)
        training_file_id = training_response.get("id")
    logging.info("Training file ID is ready: %s", training_file_id)
    return training_file_id

def wait_for_training_file(training_file_id):
    while training_file_id is None:
        logging.info("Waiting for training_file_id...")
        time.sleep(30)
        training_file_id = get_training_file_id()
    logging.info("Training file is ready: %s", training_file_id)

def get_training_file_id():
    # Replace with your logic to get the training_file_id
    return None  # Return None for demonstration purposes

def get_fine_tuning_status(job_id):
    response = openai.FineTuningJob.retrieve(job_id)
    return response["status"]

if __name__ == "__main__":
    training_file_path = input("Enter the path to train.jsonl: ")
    training_file_id = upload_training_file(training_file_path)
    model_name = "gpt-3.5-turbo"
    suffix_name = "Quantchat"

    finetune_instance = GPTFinetune(training_file_id, model_name, suffix_name)
    finetune_instance.start_fine_tuning()

    wait_for_training_file(training_file_id)

    while True:
        status = get_fine_tuning_status(finetune_instance.job_id)
        logging.info("Fine-tuning status: %s", status)
        if status == "succeeded" or status == "failed":
            break
        time.sleep(60)  # Wait for a minute before checking again

