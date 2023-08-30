from solidgpt.src.tools.lowdefy.runner.buildwebapprunner import WebAppRunner
from solidgpt.src.util.util import *
from solidgpt.src.workskill.workskill import *


class RunApp(WorkSkill):

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_RUN_APP
        self.skill_input = SkillInput(
            "Lowdefy project folder",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Host lowdefy webapp",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output)
        self.project_folder_path = None


    def _read_input(self):
        self.project_folder_path = self.get_input_path(self.skill_input)

    def execution_impl(self):
        logging.info("Start to run web app...")
        runner = WebAppRunner("webapp", self.project_folder_path)
        runner.build_run_webapp()
        return
