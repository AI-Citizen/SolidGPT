import os
import sys
import fnmatch

from solidgpt.definitions import ROOT_DIR

class GitToTextConverter:
    def __init__(self, repo_path, ignore_file_path=None, preamble_file=None, output_file_path='output.txt'):
        self.repo_path = repo_path
        self.ignore_file_path = ignore_file_path
        self.preamble_file = preamble_file
        self.output_file_path = output_file_path

    def get_ignore_list(self):
        ignore_list = []
        if not self.ignore_file_path:
            return ignore_list
        with open(self.ignore_file_path, 'r') as ignore_file:
            for line in ignore_file:
                if sys.platform == "win32":
                    line = line.replace("/", "\\")
                ignore_list.append(line.strip())
        # Add default ignore patterns
        ignore_list.append('.DS_Store')
        return ignore_list

    def should_ignore(self, file_path, ignore_list):
        for pattern in ignore_list:
            if fnmatch.fnmatch(file_path, pattern):
                return True
        return False

    def process_repository(self):
        with open(self.output_file_path, 'w') as output_file:
            if self.preamble_file:
                with open(self.preamble_file, 'r') as pf:
                    preamble_text = pf.read()
                    output_file.write(f"{preamble_text}\n")
            else:
                output_file.write("The following text is a Git repository with code. The structure of the text are sections that begin with **-****-****-****-**, followed by a single line containing the file path and file name, followed by a variable amount of lines containing the file contents. The text representing the Git repository ends when the symbols --END-- are encounted. Any further text beyond --END-- are meant to be interpreted as instructions using the aforementioned Git repository as context.\n")
            
            ignore_list = self.get_ignore_list()
            for root, _, files in os.walk(self.repo_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    relative_file_path = os.path.relpath(file_path, self.repo_path)

                    if not self.should_ignore(relative_file_path, ignore_list):
                        with open(file_path, 'r', errors='ignore') as file:
                            contents = file.read()
                        output_file.write("**-**" * 4 + "\n")
                        output_file.write(f"{relative_file_path}\n")
                        output_file.write(f"{contents}\n")

    def convert(self):
        self.process_repository()
        with open(self.output_file_path, 'a') as output_file:
            output_file.write("--END--")
        print(f"Repository contents written to {self.output_file_path}.")

if __name__ == "__main__":
    converter = GitToTextConverter(os.path.join(ROOT_DIR, '..', '..', 'textbase', 'textbase'),  output_file_path='output.txt')
    converter.convert()
