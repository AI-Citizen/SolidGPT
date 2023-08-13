from solidgpt.orchestration.orchestration import *

# generate save data
# app = Orchestration()
# app.create_default_scenario(0)
# app.save_data("data.json")


# execute app
app = Orchestration()
app.create_default_scenario(1)
app.execute()

# generate save data
# app = Orchestration()
# app.load_data()
# app.save_data("data.json")
