from solidgpt.orchestration.orchestration import *

# generate save data
# app = Orchestration()
# app.create_default_scenario()
# app.save_data("data.json")


# execute app
# app = Orchestration()
# app.create_default_scenario()
# app.execute()

# generate save data
app = Orchestration()
app.load_data()
app.save_data("data.json")
