from solidgpt.workskill.workskill import *
from solidgpt.constants import *


class WorkAgent:
    name: str = ""
    skill: WorkSkill = None
    skills_available: list[str] = []
    node = None

    def __init__(self, name : str, skills_available : list[str], skill : WorkSkill):
        self.name = name
        self.skills_available = skills_available
        self.node = None
        self.skill = skill if skill.name in self.skills_available else None
        if self.skill:
            self.skill.agent = self
        return

    def execute(self):
        print("Agent " + str(self.name) + " executing...")
        self.skill.execute()
