import logging
import openai
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.manager.promptresource import SDE_LOWDEFY_PAGE_ASSUMPTION, SDE_PAGE_YAML_OUTPUT_TEMPLATE, \
    build_gpt_prompt, SDE_FRONTEND_ASSUMPTION, SDE_FRONTEND_OUTPUT_TEMPLATE
from solidgpt.saveload.saveload import *
from solidgpt.util.util import *
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *
from solidgpt.tools.lowdefy.validator.yaml_validator import YAMLValidator


class WriteSubPage(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_WRITE_SUB_PAGE
        self.skill_input = SkillInput(
            "High level design document",
            SkillIOParamCategory.KanbanBoard,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Write page YAML Result",
            SkillIOParamCategory.YAML,
        )
        self.add_output(self.skill_output)
        self.kanban_md: str = ""

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.kanban_md = load_from_md(input_path)

    def execution_impl(self):
        print("Printing page YAML result here...")
        task_prompt = build_gpt_prompt(SDE_FRONTEND_ASSUMPTION, SDE_FRONTEND_OUTPUT_TEMPLATE)
        task_info = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo",
            prompt=task_prompt,
            gpt_model_label="find homepage task",
            input_message=self.kanban_md
        )
        for task in task_info.split("\n"):
            summarize_prompt = "Summarize the page name in one word"
            page_name = self.gpt_manager.create_and_chat_with_model(
                model="gpt-3.5-turbo",
                prompt=summarize_prompt,
                gpt_model_label="summarize page name",
                input_message=task
            )
            if page_name.lower() not in {"mainpage", "homepage", "main"}:
                error_count = 0
                while error_count < 5:
                    try:
                        yaml = self.__run_write_page_yaml_model(task)
                    except:
                        print("Malformed Yaml, trying again.")
                        error_count += 1
                        continue

                    save_to_yaml(os.path.join(self.skill_output.param_path, page_name.lower()), yaml)
                    break

                if error_count >= 5:
                    print_error_message("Error, trying too many times and writing sub page still fails.")
        return

    def __run_write_page_yaml_model(self, task):
        logging.info("Running write page yaml model...")
        page_prompt = build_gpt_prompt(SDE_LOWDEFY_PAGE_ASSUMPTION, SDE_PAGE_YAML_OUTPUT_TEMPLATE)

        message = f"Task:\nCreate the yaml file that implements the following tasks in kanban board \n{task}"
        gpt_output = self.gpt_manager.create_and_chat_with_model(
            model="gpt-3.5-turbo-16k",
            prompt=page_prompt,
            gpt_model_label="write page yaml",
            input_message=message
        )
        primitive_yaml = YAMLValidator.parse(gpt_output)
        validator = YAMLValidator(primitive_yaml)
        return validator.validate()
