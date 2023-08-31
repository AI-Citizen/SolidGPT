from solidgpt.src.tools.notion.notionactions import NotionActions

notion_actions = NotionActions()
notion_actions.process_markdown_and_upload("files/hello.md")
k = input()
notion_actions.sync_from_notion("files", "new_hello")