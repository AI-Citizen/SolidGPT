from solidgpt.src.tools.notion.notionactions import NotionActions

notion_actions = NotionActions()
notion_actions.process_markdown_and_upload("files/file1.md")
k = input()
notion_actions.sync_from_notion("files", "file2")