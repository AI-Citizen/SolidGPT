from solidgpt.workagent.workagent import *


class AgentSoftwareDeveloper(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().__init__()
        self.name = AGENT_NAME_SOFTWARE_DEVELOPER
        self.skill = skill
        self.skill.agent = self
        self.skills_available = [
            SKILL_NAME_DEBUG_CODE,
            SKILL_NAME_WRITE_CODE
        ]
        pass
