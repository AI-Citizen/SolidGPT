import os
import openai
import time

openai.api_key = os.getenv("OPENAI_API_KEY")

def wait_for_training_file(training_file_id):
    while training_file_id is None:
        print("Waiting for training_file_id...")
        time.sleep(30)
        training_file_id = get_training_file_id()
    print("Training file is ready:", training_file_id)

def get_training_file_id():
    # Replace with your logic to get the training_file_id
    return None  # Return None for demonstration purposes

def start_fine_tuning(training_file_id, model_name, suffix_name):
    model_details = openai.FineTuningJob.create(training_file=training_file_id, model=model_name, suffix=suffix_name)
    job_id = model_details["id"]
    print("Fine-tuning job started:", job_id)
    return job_id

def get_fine_tuning_status(job_id):
    response = openai.FineTuningJob.retrieve(job_id)
    return response

def main():
    training_file_name = 'train.jsonl'
    training_file_id = None  # Replace with your logic to get the training_file_id

    wait_for_training_file(training_file_id)

    model_name = "gpt-3.5-turbo"
    suffix_name = "Quantchat"
    job_id = start_fine_tuning(training_file_id, model_name, suffix_name)

    while True:
        status = get_fine_tuning_status(job_id)
        print("Fine-tuning status:", status["status"])
        if status["status"] == "succeeded" or status["status"] == "failed":
            break
        time.sleep(60)  # Wait for a minute before checking again

if __name__ == "__main__":
    main()

