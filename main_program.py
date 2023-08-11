from solidgpt.orchestration.orchestration import *

# # generate save data
app = Orchestration()
app.create_default_scenario()
app.generate_save_data()


# execute app
# app = Orchestration()
# app.create_default_scenario()
# app.execute()