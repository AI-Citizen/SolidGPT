import os
import subprocess

from definitions import ROOT_DIR

class WebAppRunner:

    def __init__(self, app_name : str, project_folder : str):
        self.app_name = app_name
        self.project_folder = project_folder

    def __build_docker_image(self):
        docker_file_path = os.path.join(ROOT_DIR, "solidgpt",  "tools", "lowdefy", "runner", ".")
        try:
            subprocess.run(
                [
                    "docker",
                    "build",
                    "-t",
                    self.app_name,
                    "--build-arg",
                    f"INPUT_APP_PROJECT_PATH={self.project_folder}",
                    docker_file_path,
                ],
                check=True,
            )
            print("Docker image built successfully.")
        except subprocess.CalledProcessError as e:
            print("Error building Docker image:", e)

    def __run_docker_container(self):
        try:
            subprocess.run(
                ["docker", "run", "-it", "--rm", "-p", "3000:3000", self.app_name],
                check=True,
            )
        except subprocess.CalledProcessError as e:
            print("Error running Docker container:", e)

    def build_run_webapp(self):
        self.__build_docker_image()
        self.__run_docker_container()

