from solidgpt.saveload.saveload import SKILL_NAME_TO_CONSTRUCTOR
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

    def _agent_setup(self, name: str, skills_available: list[str], skill: WorkSkill):
        self.name = name
        self.skills_available = skills_available
        # TODO: currently custom skill is avaliable for all agents, but it should be limited to certain agents
        self.skill = skill if skill.name in self.skills_available or skill.name not in SKILL_NAME_TO_CONSTRUCTOR.keys else None
        return