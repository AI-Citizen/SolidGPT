from solidgpt.workagent.workagent import *
from solidgpt.workskill.skills.skill_debugcode import DebugCode
from solidgpt.workskill.skills.skill_writecode import WriteCode


class AgentSoftwareDeveloper(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().agent_setup(
            name=AGENT_NAME_SOFTWARE_DEVELOPER,
            skills_available=[SKILL_NAME_DEBUG_CODE, SKILL_NAME_WRITE_CODE],
            skill=skill,
            )
