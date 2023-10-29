import logging

from solidgpt.src.workgraph.displayresult import DisplayResult
from solidgpt.src.workskill.skillio import *
from solidgpt.src.constants import *


class WorkSkill:
    name: str = ""
    inputs: list[SkillInput] = []
    outputs: list[SkillOutput] = []
    action: str = ""
    # Setup by node
    graph_cache: dict = {}
    display_result: DisplayResult = None
    callback_func = None
    graph = None

    def __init__(self):
        self.name = ""
        self.inputs = []
        self.outputs = []
        self.action = ""
        self.display_result = DisplayResult()
        self.callback_func = None
        self.graph = None
        return

    def add_input(self, skill_input: SkillInput):
        self.inputs.append(skill_input)

    def add_output(self, skill_output: SkillOutput):
        self.outputs.append(skill_output)

    def init_config(self, input_config, output_config):
        if len(input_config) != len(self.inputs):
            logging.error("Skill %s: Input config is not correct, expected number of input: %d, actual number of input: %d."
                  % (self.name, len(self.inputs), len(input_config)))
            return
        if len(output_config) != len(self.outputs):
            logging.error("Skill %s: Output config is not correct, expected number of output: %d, actual number of output: %d."
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

    def _save_to_result_cache(self, skill_output: SkillOutput, content: str):
        if skill_output is not None and skill_output.to_display and content is not None:
            self.display_result.set_result(content)

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
    
    def _get_graph_cached_content(self, label):
        if label not in self.graph_cache:
            return None
        return self.graph_cache[label]
    
    def _set_graph_cached_content(self, label, content):
        self.graph_cache[label] = content
        return
