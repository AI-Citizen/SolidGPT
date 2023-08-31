from solidgpt.src.orchestration.orchestration import *

Initializer()
app = Orchestration()
app.add_graph("workspace/config/config_data.json", "default graph")
app.run_graph_with_name("default graph")
