from solidgpt.workagent.workagent import *

class AgentSoftwareDeveloper(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super()._agent_setup(
            name=AGENT_NAME_SOFTWARE_DEVELOPER,
            skills_available=[SKILL_NAME_DEBUG_CODE, SKILL_NAME_WRITE_CODE, SKILL_NAME_RUN_APP],
            skill=skill,
            )
