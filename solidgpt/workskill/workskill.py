from solidgpt.workskill.skillio import *
from solidgpt.constants import *


class WorkSkill:
    name: str = ""
    inputs: list[SkillInput] = []
    outputs: list[SkillOutput] = []
    action: str = ""
    agent = None

    def __init__(self):
        self.agent = None
        self.name = ""
        self.inputs = []
        self.outputs = []
        self.action = ""
        return

    def add_input(self, skill_input: SkillInput):
        self.inputs.append(skill_input)

    def add_output(self, skill_output: SkillOutput):
        self.outputs.append(skill_output)

    def init_config(self, input_config, output_config):
        if len(input_config) != len(self.inputs):
            print("Skill %s: Input config is not correct, expected number of input: %d, actual number of input: %d."
                  % (self.name, len(self.inputs), len(input_config)))
            return
        if len(output_config) != len(self.outputs):
            print("Skill %s: Output config is not correct, expected number of output: %d, actual number of output: %d."
                  % (self.name, len(self.outputs), len(output_config)))
            return
        for i in range(len(input_config)):
            self.inputs[i].apply_config(input_config[i])
        for o in range(len(output_config)):
            self.outputs[o].apply_config(output_config[o])
        return

    def execute(self):
        print("Agent finishes " + str(self.name) + " task...")
        if self.agent: 
            self.agent.node.finish_execution()
        return
