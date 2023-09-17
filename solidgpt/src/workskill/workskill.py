from solidgpt.src.workskill.skillio import *
from solidgpt.src.constants import *


class WorkSkill:
    name: str = ""
    inputs: list[SkillInput] = []
    outputs: list[SkillOutput] = []
    action: str = ""
    # Setup by node
    graph_cache: dict = {}

    def __init__(self):
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
        self.begin_execution()
        self.execution_impl()
        self.finish_execution()

    def execution_impl(self):
        pass

    def begin_execution(self):
        print("Node begins " + str(self.name) + " task...")
        self._read_input()
        pass

    def finish_execution(self):
        print("Node finishes " + str(self.name) + " task...")
        return

    def _read_input(self):
        pass

    def get_input_path(self, skill_input: SkillInput):
        return skill_input.get_input_path()
