from solidgpt.workagent.workagent import *


class AgentPrincipalEngineer(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super()._agent_setup(
            name=AGENT_NAME_PRINCIPAL_ENGINEER,
            skills_available=[SKILL_NAME_WRITE_HLD, SKILL_NAME_CREATE_KANBAN_BOARD],
            skill=skill,
            )
