from solidgpt.src.workskill.workskill import *
from abc import ABC, abstractmethod
from solidgpt.src.constants import *


class WorkAgent(ABC):
    name: str = ""
    skill: WorkSkill = None
    skills_available: list[str] = []
    graph_cache: dict = {}

    @abstractmethod
    def __init__(self, skill: WorkSkill):
        pass

    def _agent_setup(self, name: str, skills_available: list[str], skill: WorkSkill):
        self.name = name
        self.skills_available = skills_available
        skill.graph_cache = self.graph_cache
        self.skill = skill
        return