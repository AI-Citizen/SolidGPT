from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import PE_KANBAN_OUTPUT_TEMPLATE, PE_ROE_ASSUMPTION, build_gpt_prompt
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *


class CreateKanBan(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_CREATE_KANBAN_BOARD
        self.skill_input = SkillInput(
            "HLD Doc",
            SkillIOParamCategory.HighLevelDesignDocument,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Create Kanban Board",
            SkillIOParamCategory.KanbanBoard,
        )
        self.add_output(self.skill_output)
        self.input_hld : str = None

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.input_hld = load_from_text(input_path)

    def execution_impl(self):
        print("Printing Kanban result here...")
        kanban = self.__run_create_kanban_model()
        save_to_md2(self.skill_output.param_path, kanban)
        return
    
    def __run_create_kanban_model(self,):
        logging.info("Running create kanban model...")
        prompt = build_gpt_prompt(PE_ROE_ASSUMPTION, PE_KANBAN_OUTPUT_TEMPLATE)
        return self.gpt_manager.create_and_chat_with_model(
            prompt=prompt,
            gpt_model_label="create_kanban",
            input_message=self.input_hld
        )
