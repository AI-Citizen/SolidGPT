import logging
import openai
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE, \
    SDE_FRONTEND_HOMEPAGE_ASSUMPTION, SDE_FRONTEND_OUTPUT_TEMPLATE, SDE_FRONTEND_ASSUMPTION, build_gpt_prompt
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
            SkillIOParamCategory.KanbanBoard,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Write YAML Result",
            SkillIOParamCategory.YAML,
        )
        self.add_output(self.skill_output)
        self.kanban_md: str = ""

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.kanban_md = load_from_md(input_path)

    def execution_impl(self):
        print("Printing YAML result here...")
        yaml = self.__run_write_yaml_model()
        save_to_yaml(os.path.join(self.skill_output.param_path, "lowdefy"), yaml)
        return

    def build_reference_list(self):
        ret = []
        prompt = build_gpt_prompt(SDE_FRONTEND_ASSUMPTION, SDE_FRONTEND_OUTPUT_TEMPLATE)
        task_info = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=prompt,
            gpt_model_label="find create page tasks",
            input_message=self.kanban_md
        )
        for task in task_info.split("\n"):
            summarize_prompt = "Summarize the page name in one word"
            page_name = self.gpt_manager.create_and_chat_with_model(
                model="gpt-3.5-turbo",
                prompt=summarize_prompt,
                gpt_model_label="write_yaml",
                input_message=task
            )
            if page_name.lower() not in {"mainpage", "homepage", "main"}:
                ret.append(page_name.lower())
        return ret

    def __run_write_yaml_model(self, ):
        logging.info("Running write lowdefy yaml model...")
        task_prompt = build_gpt_prompt(SDE_FRONTEND_HOMEPAGE_ASSUMPTION, SDE_FRONTEND_OUTPUT_TEMPLATE)
        page_prompt = build_gpt_prompt(SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE)
        task_info = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=task_prompt,
            gpt_model_label="find homepage task",
            input_message=self.kanban_md
        )
        message = f"Task:\nCreate the yaml file that implements the following task in kanban board " \
                  f"with the name lowdefy.yaml\n{task_info}"
        gpt_output = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=page_prompt,
            gpt_model_label="write lowdefy yaml",
            input_message=message
        )
        primitive_yaml = YAMLValidator.parse(gpt_output)
        validator = YAMLValidator(primitive_yaml)
        verified_type_yaml = validator.validate()
        refence_list = self.build_reference_list()
        ret_yaml = validator.add_reference(verified_type_yaml, refence_list)
        return ret_yaml
