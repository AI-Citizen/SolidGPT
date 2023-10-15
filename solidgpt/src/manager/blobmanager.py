from azure.storage.blob import BlobServiceClient, ContainerClient, BlobProperties
from solidgpt.src.configuration.configreader import ConfigReader


class AzureBlobManager:
    def __init__(self, connection_string):
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)

    def upload_blob(self, container_name, blob_name, data, overwrite=True):
        blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        blob_client.upload_blob(data, overwrite=overwrite)

    def download_blob(self, container_name, blob_name):
        blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        return blob_client.download_blob().readall()

    def list_blobs(self, container_name : str):
        container_client = self.blob_service_client.get_container_client(container=container_name)
        return [blob.name for blob in container_client.list_blobs()]

    def delete_blob(self, container_name, blob_name):
        blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        blob_client.delete_blob()

    def clear_container(self, container_name):
        container_client: ContainerClient = self.blob_service_client.get_container_client(container_name)
        container_client.delete_blobs(*container_client.list_blobs())


# Usage
if __name__ == "__main__":
    CONNECTION_STRING = ConfigReader().get_property("azure_blob_connection_string")
    manager = AzureBlobManager(CONNECTION_STRING)

    # Sample Usage
    manager.upload_blob("repos", "sample.txt", "This is a sample text.", overwrite=True)
    manager.upload_blob("repos", "sample1.txt", "This is another sample text.", overwrite=True)
    print(manager.list_blobs("repos"))
    sample_text = manager.download_blob("repos", "sample.txt").decode("utf-8")
    # manager.clear_container("repos")
    print(sample_text)
