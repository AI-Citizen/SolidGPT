
import os
import logging

ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root
SRC_DIR = os.path.join(ROOT_DIR, "src")
TEST_DIR = os.path.join(ROOT_DIR, "test")
LOCAL_STORAGE_DIR = os.path.join(ROOT_DIR, "../localstorage")
LOCAL_STORAGE_OUTPUT_DIR = os.path.join(LOCAL_STORAGE_DIR, "workspace", "out") # You can change this to your own output dir
TEST_SKILL_WORKSPACE = os.path.join(TEST_DIR, "workskill", "skills", "workspace")
logging.basicConfig(level=logging.INFO)