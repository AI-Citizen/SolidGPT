from solidgpt.workagent.workagent import *
from solidgpt.workskill.skills.skill_usenotion import UseNotion
from solidgpt.workskill.skills.skill_writePRD import WritePRD


class AgentProductManager(WorkAgent):

    def __init__(self, skill: WorkSkill):
        super().agent_setup(
            name=AGENT_NAME_PRODUCT_MANAGER,
            skills_available=[SKILL_NAME_WRITE_PRODUCT_REQUIREMENTS_DOCUMENTATION, SKILL_NAME_USE_NOTION],
            skill=skill,
            )
