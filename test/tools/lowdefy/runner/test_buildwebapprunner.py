import os
from definitions import TEST_DIR
from solidgpt.tools.lowdefy.runner.buildwebapprunner import WebAppRunner

if __name__ == "__main__":
    runner = WebAppRunner("testdomo", os.path.join(TEST_DIR, "tools", "lowdefy", "runner", "demoapp"))
    runner.build_run_webapp()