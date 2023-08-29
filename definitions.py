
import os
import logging

ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root
TEST_DIR = os.path.join(ROOT_DIR, "test")
LOCAL_STORAGE_DIR = os.path.join(ROOT_DIR, "localstorage")
logging.basicConfig(level=logging.INFO)