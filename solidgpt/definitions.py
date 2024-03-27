
import os
import logging

ROOT_DIR = os.path.dirname(os.path.abspath(__file__)) # This is your Project Root
SRC_DIR = os.path.join(ROOT_DIR, "src")
TEST_DIR = os.path.join(ROOT_DIR, "test")
LOCAL_STORAGE_DIR = os.path.join(ROOT_DIR, "../localstorage")
REPO_STORAGE_DIR = os.path.join(LOCAL_STORAGE_DIR, "repo")
LOCAL_STORAGE_WORKSPACE_DIR = os.path.join(LOCAL_STORAGE_DIR, "workspace")
LOCAL_STORAGE_OUTPUT_DIR = os.path.join(LOCAL_STORAGE_WORKSPACE_DIR, "out0325") # You can change this to your own output dir
TEST_SKILL_WORKSPACE = os.path.join(TEST_DIR, "workskill", "skills", "workspace")
EMBEDDING_BLOB_CONTAINER = "embedding1002"
logging.basicConfig(level=logging.INFO)
SUPPORT_EXTENSION = [".py", ".java", ".js", ".ts", "tsx", "css", "jsx", "go", ".cs", ".cpp", ".rb", ".rs", ".swift", ".m", ".h", ".kt", ".php", ".scala", ".dart", ".R", ".clj", ".ex", ".hs", ".jl", ".lua", ".ml", ".pl", ".sql", ".vb"]