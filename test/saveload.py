from solidgpt.orchestration.orchestration import *


def compare_json_files(file1_path, file2_path):
    # Read JSON data from the first file
    with open(file1_path, 'r') as file1:
        data1 = json.load(file1)

    # Read JSON data from the second file
    with open(file2_path, 'r') as file2:
        data2 = json.load(file2)

    # Compare the JSON data
    assert data1 == data2
    return


FILE_1_PATH = "./tempdata/data1.json"
FILE_2_PATH = "./tempdata/data2.json"


"""Create Orchestration"""
app = Orchestration()

"""Create Default Scenario (Code + Debug)"""
app.create_default_scenario()

"""Save data to a json file"""
app.save_data(FILE_1_PATH)

"""Create 2nd app"""
loading_app = Orchestration()

"""load data, then save to another file"""
loading_app.load_data(FILE_1_PATH)
loading_app.save_data(FILE_2_PATH)

"""Validate data is the same"""
compare_json_files(FILE_1_PATH, FILE_2_PATH)

print("Test Pass")