import openai
import logging
import asyncio

class GPTFinetune:
    def __init__(self, model_name, suffix_name, training_file_path):
        self.training_file_id = None
        self.model_name = model_name
        self.suffix_name = suffix_name
        self.job_id = None
        self.training_file_path = training_file_path
        openai.api_key = ConfigReader().get_property("openai_api_key")

    async def start_fine_tuning(self):
        await self.__upload_training_file()
        model_details = openai.FineTuningJob.create(
            training_file=self.training_file_id,
            model=self.model_name,
            suffix=self.suffix_name
        )
        self.job_id = model_details["id"]
        logging.info("Fine-tuning job started: %s", self.job_id)

    async def __upload_training_file(self):
        training_response = await openai.File.create(
            file=open(self.training_file_path, "rb"), purpose="fine-tune"
        )
        self.training_file_id = training_response["id"]
        logging.info("Training file ID is ready: %s", self.training_file_id)

    async def get_fine_tuning_status(self):
        response = await openai.FineTuningJob.retrieve(self.job_id)
        return response["status"]

# Sample
if __name__ == "__main__":
    training_file_path = input("Enter the path to train.jsonl: ")
    model_name = "gpt-3.5-turbo"
    suffix_name = "Quantchat"
    finetune_instance = GPTFinetune(model_name, suffix_name, training_file_path)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(finetune_instance.start_fine_tuning())

    async def wait_for_finetuning_complete():
        while True:
            status = await finetune_instance.get_fine_tuning_status()
            logging.info("Fine-tuning status: %s", status)
            if status == "succeeded" or status == "failed":
                break
            await asyncio.sleep(60)

    loop.run_until_complete(wait_for_finetuning_complete())
