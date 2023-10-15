
import logging
from solidgpt.src.constants import SKILL_NAME_SUMMARY_PROJECT
from solidgpt.src.manager.gptmanager import GPTManager
from solidgpt.src.manager.promptresource import SUMMARY_CODE_SUMMARY_README, SUMMARY_CODE_SUMMARY_SCHEMA
from solidgpt.src.util.util import load_from_text, save_to_text
from solidgpt.src.workskill.skillio import SkillIOParamCategory, SkillInput, SkillInputLoadingMethod, SkillOutput
from solidgpt.src.workskill.workskill import WorkSkill


class SummaryProject(WorkSkill):

    Seperator = "**-****-****-****-**"
    Cache_Label_Summary_Repo_Schema = "summary_repo_schema"
    Cache_Label_Summary_Readme = "summary_readme"

    def __init__(self):
        super().__init__()
        self.name = SKILL_NAME_SUMMARY_PROJECT
        self.gpt_manager = GPTManager._instance
        self.skill_input = SkillInput(
            "Plain code text",
            SkillIOParamCategory.CODE_PLAIN_TEXT,
        )
        self.add_input(self.skill_input)
        self.skill_output_code_summary = SkillOutput(
            "Code Summary",
            SkillIOParamCategory.PlainText,
        )
        self.skill_output_code_schema = SkillOutput(
            "Code Schema",
            SkillIOParamCategory.PlainText,
        )
        self.add_output(self.skill_output_code_summary)
        self.add_output(self.skill_output_code_schema)
        self.repo_txt : str = None

    def _read_input(self):
        input_path = self.get_input_path(self.skill_input)
        self.repo_txt = load_from_text(input_path, extension=".txt")

    def execution_impl(self):
        logging.info("Start to summary code...")
        self.__summary_repo_schema()
        self.__summary_readme()
        save_to_text(self.skill_output_code_summary.param_path, self.graph_cache[self.Cache_Label_Summary_Readme])
        self._save_to_result_cache(self.skill_output_code_summary, self.graph_cache[self.Cache_Label_Summary_Readme])
        save_to_text(self.skill_output_code_schema.param_path, self.graph_cache[self.Cache_Label_Summary_Repo_Schema])
        self._save_to_result_cache(self.skill_output_code_schema, self.graph_cache[self.Cache_Label_Summary_Repo_Schema])
        return
    
    def __summary_repo_schema(self):
        schema = self.__extract_lines_after_sequence()
        schema_summary = self.gpt_manager.create_and_chat_with_model(
            prompt=SUMMARY_CODE_SUMMARY_SCHEMA,
            gpt_model_label="repo_schema",
            input_message=schema
        )
        self._set_graph_cached_content(self.Cache_Label_Summary_Repo_Schema, schema)
        logging.info(f"Schema of repo: {schema_summary}")

    def __summary_readme(self):
        readme = self.__extract_readme_content()
        # set Cache_Label_Summary_Readme
        self._set_graph_cached_content(self.Cache_Label_Summary_Readme, "")
        if readme is None:
            logging.warn("No readme file found")
            return
        readme_summary = self.gpt_manager.create_and_chat_with_model(
            prompt=SUMMARY_CODE_SUMMARY_README,
            gpt_model_label="summary_readme",
            input_message=readme
        )
        self._set_graph_cached_content(self.Cache_Label_Summary_Readme, readme_summary)
        logging.info(f"Summary of readme file: {readme_summary}")

    def __extract_lines_after_sequence(self) -> str:
        lines = self.repo_txt.split('\n')
        capture = False
        captured_lines = []
        for line in lines:
            if capture:
                captured_lines.append(line)
                capture = False
            if self.Seperator in line:
                capture = True
        return '\n'.join(captured_lines)
    
    def __extract_readme_content(self):
    # Split the text by the sequence
        blocks = self.repo_txt.split(self.Seperator)
        for block in blocks:
            # Check the first line of each block
            first_line = block.strip().split('\n')[0]
            
            if first_line.lower() in ["readme.md", "readme.rst"]:
                # Remove the first line (filename) and return the rest
                return '\n'.join(block.strip().split('\n')[1:])
        return None  # If no desired file is found

    