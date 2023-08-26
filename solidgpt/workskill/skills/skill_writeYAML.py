import logging
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE, build_gpt_prompt
from solidgpt.saveload.saveload import *
from solidgpt.util.util import *
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *
from solidgpt.tools.lowdefy.validator.yaml_validator import YAMLValidator


class WriteYAML(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_WRITE_YAML
        self.skill_input = SkillInput(
            "High level design document",
            SkillIOParamCategory.HighLevelDesignDocument,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Write YAML Result",
            SkillIOParamCategory.YAML,
        )
        self.add_output(self.skill_output)
        self.hld_md: str = ""

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.hld_md = load_from_md(input_path)

    def execution_impl(self):
        print("Printing HLD result here...")
        yaml = self.__run_write_yaml_model()
        save_to_yaml(self.skill_output.param_path, yaml)
        return

    def __run_write_yaml_model(self, ):
        logging.info("Running write hld model...")
        prompt = build_gpt_prompt(SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE)
        message = f"Task:\nCreate the yaml file that implements the following high level design " \
                  f"document with the name lowdefy.yaml\n{self.hld_md}"
        gpt_output = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="write_yaml",
            input_message=message
        )
        primitive_yaml = YAMLValidator.parse(gpt_output)
        validator = YAMLValidator(primitive_yaml)
        return validator.validate()
