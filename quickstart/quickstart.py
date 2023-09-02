
from solidgpt.src.orchestration.orchestration import *

def quick_start(category:str):
    Initializer()
    app = Orchestration()
    app.add_graph(os.path.join(LOCAL_STORAGE_DIR, "workspace", "config", f"{category}_config_data.json"), "default graph")
    app.run_graph_with_name("default graph")


def main():
    # Check if the correct number of arguments are provided
    if len(sys.argv) <2 or sys.argv[1] not in ["system", "webapp"]:  # Adjust this number based on the number of arguments you expect
        logging.info("Usage: python3 creategraph.py system (or webapp)")
        sys.exit(1)
    param = sys.argv[1]
    quick_start(param)

if __name__ == "__main__":
    main()