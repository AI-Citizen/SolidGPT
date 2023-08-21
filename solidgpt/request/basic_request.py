import requests
import logging
from enum import Enum

class RequestMethod(Enum):
    POST = 1
    GET = 2
    PATCH = 3
    DELETE = 3

class BasicRequest:
    def __init__(self, url : str, method : RequestMethod, headers : str, params : str, data : dict):
        self.url = url
        self.method = method
        self.headers = headers
        self.params = params
        self.data = data
        self.response = None

    def __str__(self):
        return f"basic_request(url={self.url}, method={self.method}, headers={self.headers}, params={self.params}, data={self.data})"

    def __repr__(self):
        return self.__str__()
    
    def call(self):
        if self.method == RequestMethod.GET:
            self.response = requests.get(self.url, headers=self.headers, params=self.params)
        elif self.method == RequestMethod.POST:
            self.response = requests.post(self.url, headers=self.headers, json=self.data)
        else:
            raise Exception("Invalid method")
        logging.info(f"Response: {self.response}")
        return self.response