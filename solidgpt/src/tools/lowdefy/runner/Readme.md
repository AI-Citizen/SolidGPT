## How to Use

### Building and Running with Docker

#### Prerequisites

Before getting started, ensure that you have Docker installed on your system.
https://docs.docker.com/engine/install/

#### Setting Up Your Project

1. Begin by creating your lowdefy YAML files within a designated folder.
2. Create an instance of the `WebAppRunner` class, providing the project folder path and the web app's name.
3. Execute the `build_run_webapp` function to initiate the build and run process.

After completing these steps, you can visit [http://localhost:3000](http://localhost:3000) to interact with your web application.

```python
import os
from solidgpt.definitions import TEST_DIR
from solidgpt.src.tools.lowdefy.runner.buildwebapprunner import WebAppRunner

if __name__ == "__main__":
    runner = WebAppRunner("testdomo", os.path.join(TEST_DIR, "tools", "lowdefy", "runner", "demoapp"))
    runner.build_run_webapp()
```

