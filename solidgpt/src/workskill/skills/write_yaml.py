from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import SDE_KANBAN_ITEM_TO_LOWDEFY_DESCRIPTION_ASSUMPTION, \
    SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE, \
    SDE_FRONTEND_HOMEPAGE_ASSUMPTION, build_gpt_prompt, \
    SDE_LOWDEFY_PAGE_ASSUMPTION, SDE_PAGE_YAML_OUTPUT_TEMPLATE, SDE_SUMMARIZE_TASK_ASSUMPTION, \
    SDE_AI_TASKS_OUTPUT_TEMPLATE
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *
from solidgpt.src.tools.lowdefy.validator.yaml_validator import YAMLValidator


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
        self.task_info: str = ""
        self.reference_list: list = []

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        kanban = load_from_text(input_path)
        self.kanban_md = self.__kanban_transfer_to_ai_tasks(kanban)

    def execution_impl(self):
        logging.info("Printing page YAML result here...")

        task_prompt = build_gpt_prompt(SDE_FRONTEND_HOMEPAGE_ASSUMPTION, SDE_AI_TASKS_OUTPUT_TEMPLATE)
        homepage_info = self.gpt_manager.create_and_chat_with_model(
            prompt=task_prompt,
            gpt_model_label="find homepage task",
            input_message=self.kanban_md
        )

        homepage_name = self.gpt_manager.create_and_chat_with_model(
            prompt=SDE_SUMMARIZE_TASK_ASSUMPTION,
            gpt_model_label="summarize page name",
            input_message=homepage_info
        ).lower()
        page_prompt = build_gpt_prompt(SDE_LOWDEFY_PAGE_ASSUMPTION, SDE_PAGE_YAML_OUTPUT_TEMPLATE)
        homepage_prompt = build_gpt_prompt(SDE_LOWDEFY_ASSUMPTION, SDE_LOWDEFY_YAML_OUTPUT_TEMPLATE)
        for task in self.kanban_md.split("***New Page***\n"):
            page_name = self.gpt_manager.create_and_chat_with_model(
                prompt=SDE_SUMMARIZE_TASK_ASSUMPTION,
                gpt_model_label="summarize page name",
                input_message=task
            ).lower()

            if page_name != homepage_name and page_name not in self.reference_list:
                error_count = 0
                while error_count < 5:
                    try:
                        page_msg = f"Task:\nCreate the yaml file that implements the following tasks in kanban " \
                                   f"board \n{task}"
                        yaml = self.__run_write_yaml_model(page_msg, page_name, page_prompt, [])
                    except:
                        print("Malformed Yaml, trying again.")
                        error_count += 1
                        continue
                    save_to_yaml(os.path.join(self.skill_output.param_path, page_name), yaml)
                    self._save_to_result_cache(self.skill_output, yaml)
                    self.reference_list.append(page_name)
                    break

                if error_count >= 5:
                    print_error_message("Error, trying too many times and writing sub page still fails.")

        home_msg = f"Task:\nCreate the yaml file that implements the following task in kanban board " \
            f"with the name lowdefy.yaml\n{homepage_info}"
        yaml = self.__run_write_yaml_model(home_msg, "lowdefy", homepage_prompt, self.reference_list)
        save_to_yaml(os.path.join(self.skill_output.param_path, "lowdefy"), yaml)
        return

    def __run_write_yaml_model(self, message, page_name, prompt, subpages):
        logging.info("Running write lowdefy yaml model...")
        gpt_output = self.gpt_manager.create_and_chat_with_model(
            prompt=prompt,
            gpt_model_label="write lowdefy yaml",
            input_message=message
        )
        primitive_yaml = YAMLValidator.parse(gpt_output)
        validator = YAMLValidator(primitive_yaml, page_name, subpages)
        return validator.validate()
    
    def __kanban_transfer_to_ai_tasks(self, md_string: str) -> str:
        prompt = build_gpt_prompt(SDE_KANBAN_ITEM_TO_LOWDEFY_DESCRIPTION_ASSUMPTION, SDE_AI_TASKS_OUTPUT_TEMPLATE)
        gpt_output = self.gpt_manager.create_and_chat_with_model(
            prompt=prompt,
            gpt_model_label="write lowdefy yaml",
            input_message=md_string
        )
        logging.info(f"After transfering to AI tasks, the kanban board is: {gpt_output}")
        return gpt_output

