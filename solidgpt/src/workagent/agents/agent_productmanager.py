from solidgpt.src.workagent.workagent import *


class AgentProductManager(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super()._agent_setup(
            name=AGENT_NAME_PRODUCT_MANAGER,
            skills_available=[SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION, SKILL_NAME_USE_NOTION],
            skill=skill,
            )
