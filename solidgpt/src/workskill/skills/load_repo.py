
import logging
from solidgpt.src.constants import SKILL_NAME_LOAD_REPO
from solidgpt.src.tools.repo.gpt_repository_loader import GitToTextConverter
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill


class LoadRepo(WorkSkill):
    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_LOAD_REPO
        self.skill_input = SkillInput(
            "Repo path",
            SkillIOParamCategory.PlainText,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Plain code text",
            SkillIOParamCategory.CODE_PLAIN_TEXT,
        )
        self.add_output(self.skill_output)
        self.project_folder_path = None

    def _read_input(self):
        self.project_folder_path = self.get_input_path(self.skill_input)

    def execution_impl(self):
        logging.info(f"Start to load repo... {self.project_folder_path}")
        converter = GitToTextConverter(self.project_folder_path,  output_file_path=self.skill_output.param_path + '.txt')
        converter.convert()
        return

    