from solidgpt.workagent.workagent import *
from solidgpt.workskill.skills.skill_debugcode import DebugCode
from solidgpt.workskill.skills.skill_writecode import WriteCode


class AgentPrincipalEngineer(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().agent_setup(
            name=AGENT_NAME_PRINCIPAL_ENGINEER,
            skills_available=[SKILL_NAME_WRITE_HLD, SKILL_NAME_CREATE_KANBAN_BOARD],
            skill=skill,
            )
