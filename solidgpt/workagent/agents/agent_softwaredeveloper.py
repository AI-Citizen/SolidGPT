from solidgpt.workagent.workagent import *
from solidgpt.workskill.skills.skill_debugcode import DebugCode
from solidgpt.workskill.skills.skill_writecode import WriteCode


class AgentSoftwareDeveloper(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().__init__(
            name = AGENT_NAME_SOFTWARE_DEVELOPER, 
            skills_avaliable= [SKILL_NAME_DEBUG_CODE, SKILL_NAME_WRITE_CODE],
            skill= skill,
            )
