from solidgpt.workagent.workagent import *
from solidgpt.workskill.skills.skill_usenotion import UseNotion
from solidgpt.workskill.skills.skill_writeprd import WritePRD


class AgentProductManager(WorkAgent):

    def __init__(self, skill: WorkSkill = None):
        super().__init__(
            name = AGENT_NAME_PRODUCT_MANAGER, 
            skills_available= [SKILL_NAME_WRITE_CODE, SKILL_NAME_USE_NOTION],
            skill= skill,
            )
