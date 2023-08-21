import logging
from pynput import keyboard
from time import sleep
from solidgpt.manager.gptmanager import GPTManager
from solidgpt.saveload.saveload import *
from solidgpt.tools.notion.notionactions import NotionActions
from solidgpt.util.util import *
from solidgpt.workskill.skillio import *
from solidgpt.workskill.workskill import *


class UseNotion(WorkSkill):

    def __init__(self):
        super().__init__()
        self.gpt_manager = GPTManager._instance
        self.name = SKILL_NAME_USE_NOTION
        self.skill_input = SkillInput(
            "PRD Doc",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_input(self.skill_input)
        self.skill_output = SkillOutput(
            "Notion PRD Doc",
            SkillIOParamCategory.ProductRequirementsDocument,
        )
        self.add_output(self.skill_output)
        self.notion_actions = NotionActions()

    def _read_input(self):
        logging.info("Sync to Notion, please visit Notion to edit your PRD...")
        input_file_path: str = self.get_input_path(self.skill_input)
        input_file_path = add_extension_if_not_exist(input_file_path, ".md")
        self.notion_actions.process_markdown_and_upload(input_file_path)

    def execution_impl(self):
        logging.info("""Sync up done. 
        Please edit PRD in Notion and press A to Approve the new revision.
        Please edit PRD in Notion and press D to Deny the new revision.
        Please edit PRD in Notion and press R to Request a change for the new revision.
        """)

        with keyboard.Listener(on_press=self._on_press) as listener:
            listener.join()

        return
    
    def _on_press(self, key : keyboard.Key):
            try:
                if key.char == 'a':
                    logging.info("Approve the new PRD revision")
                    self.notion_actions.sync_from_notion(os.path.dirname(self.skill_output.param_path),
                                                         os.path.basename(self.skill_output.param_path))
                    logging.info("Sync the latest revision from notion done.")
                    return False  # Stop the listener
                elif key.char == 'd':
                    logging.info("Deny the new PRD revision")
                    # Break the work graph or perform other actions
                    return False
                elif key.char == 'r':
                    logging.info("Request the new PRD revision")
                    self.notion_actions.sync_from_notion(os.path.dirname(self.skill_output.param_path),
                                                         os.path.basename(self.skill_output.param_path))
                    sleep(2)
                    # Waiting for the new revision
            except AttributeError:
                pass

