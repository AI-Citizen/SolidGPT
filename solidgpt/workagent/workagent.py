from solidgpt.workskill.workskill import *
from solidgpt.constants import *


class WorkAgent:
    name: str = ""
    skill: WorkSkill = None
    skills_available: list[str] = []
    node = None

    def __init__(self):
        self.node = None
        return

    def execute(self):
        print("Agent " + str(self.name) + " executing...")
        self.skill.execute()
