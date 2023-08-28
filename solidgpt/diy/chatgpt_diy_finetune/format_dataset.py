import json
import argparse

def process_json(input_file, output_file):
    with open(input_file, "r") as f:
        data = json.load(f)

    processed_data = []
    user_messages = []
    assistant_messages = []

    for entry in data["messages"]:
        if entry["role"] == "user":
            user_messages.append(entry)
        elif entry["role"] == "assistant":
            assistant_messages.append(entry)

    min_length = min(len(user_messages), len(assistant_messages))
    for i in range(min_length):
        processed_data.append({"messages": [user_messages[i], assistant_messages[i]]})

    with open(output_file, "w") as f:
        for entry in processed_data:
            json.dump(entry, f)
            f.write("\n")

def main():
    parser = argparse.ArgumentParser(description="Process JSON data for chat messages.")
    parser.add_argument("input_json_file_path", type=str, help="Path to the input JSON file")
    parser.add_argument("output_json_file_path", type=str, help="Path to the output JSON file")
    args = parser.parse_args()

    process_json(args.input_json_file_path, args.output_json_file_path)

if __name__ == "__main__":
    main()

