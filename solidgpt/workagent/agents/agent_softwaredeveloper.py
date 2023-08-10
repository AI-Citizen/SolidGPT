from solidgpt.workagent.workagent import *


class AgentSoftwareDeveloper(WorkAgent):

    def __init__(self, skill: WorkSkill):
        self.name = "Software Developer"
        self.skill = skill
        self.skill.agent = self
        self.skills_available = ["Debug Code"]
        super().__init__()
        pass
