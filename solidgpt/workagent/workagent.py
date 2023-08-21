from solidgpt.workskill.workskill import *
from solidgpt.constants import *
from abc import ABC, abstractmethod


class WorkAgent(ABC):
    name: str = ""
    skill: WorkSkill = None
    skills_available: list[str] = []

    @abstractmethod
    def __init__(self, skill: WorkSkill):
        pass

    def agent_setup(self, name: str, skills_available: list[str], skill: WorkSkill):
        self.name = name
        self.skills_available = skills_available
        self.skill = skill if skill.name in self.skills_available else None
        return
