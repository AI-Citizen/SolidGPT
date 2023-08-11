from solidgpt.workskill.skillio import *


class WorkSkill:
    name: str = ""
    inputs: list[SkillInput] = []
    output: SkillOutput = None
    action: str = ""
    agent = None

    def __init__(self):
        self.agent = None
        self.name = ""
        self.inputs = []
        self.output = SkillOutput(None, "output param", SkillOutputParamType.STRING, "", -1)
        self.action = ""
        return

    def execute(self):
        print("Agent finishes " + str(self.name) + " task...")
        self.agent.node.finish_execution()
        return
