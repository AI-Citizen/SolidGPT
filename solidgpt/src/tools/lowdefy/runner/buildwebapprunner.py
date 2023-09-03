import os
import subprocess

class WebAppRunner:

    def __init__(self, app_name : str, project_folder : str):
        self.app_name = app_name
        self.project_folder = project_folder

    def build_run_webapp(self):
        # Command to run
        command = ["pnpx", "lowdefy@rc", "dev"]
        if os.name == 'nt':
            command = ["cmd.exe", "/c", "pnpx", "lowdefy@rc", "dev"]
        # Change the current working directory to the absolute path
        subprocess.run(command, cwd=self.project_folder)
