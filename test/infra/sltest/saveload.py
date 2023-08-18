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


for i in range(2):
    print("Testing scenario %d..." % i)
    FILE_1_PATH = "tempdata/data1.json"
    FILE_2_PATH = "tempdata/data2.json"

    print("Testing without debug info...")
    """Create Orchestration"""
    app = Orchestration()

    """Create Default Scenario (Code + Debug)"""
    app.create_default_scenario(i)

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
    print("Testing with debug info...")

    FILE_1_PATH = "tempdata/data1_debug.json"
    FILE_2_PATH = "tempdata/data2_debug.json"

    """Create 3rd Orchestration"""
    app = Orchestration()

    """Create Default Scenario (Code + Debug)"""
    app.create_default_scenario(i)

    """Save data to a json file"""
    app.save_data(FILE_1_PATH, generate_debug_info=True)

    """Create 4th app"""
    loading_app = Orchestration()

    """load data, then save to another file"""
    loading_app.load_data(FILE_1_PATH)
    loading_app.save_data(FILE_2_PATH, generate_debug_info=True)

    """Validate data is the same"""
    compare_json_files(FILE_1_PATH, FILE_2_PATH)
    print("Test Pass")