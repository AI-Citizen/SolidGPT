# import time
#
# from solidgpt.definitions import ROOT_DIR
# from solidgpt.src.configuration.configreader import ConfigReader
# import os
# import notional
# from notional import blocks
# from notion2md.exporter.block import MarkdownExporter
#
# NOTION_API_KEY = ConfigReader().get_property("notion_api_key")
# PAGE_ID = ConfigReader().get_property("notion_page_id")
#
# class NotionActions:
#
#     def __init__(self):
#         self.auth_token = NOTION_API_KEY
#         os.environ["NOTION_TOKEN"] = NOTION_API_KEY
#         self.notion = notional.connect(auth=self.auth_token)
#         self.page = self.notion.pages.retrieve(PAGE_ID)
#
#     def process_markdown_and_upload(self, md_file_path: str):
#
#         # clear current notion page
#         for child_block in self.notion.blocks.children.list(self.page):
#             self.notion.blocks.delete(child_block.id)
#
#         # Initialize time variables
#         start_time = time.time()
#         timeout = 20  # 20 seconds
#
#         # Check if all blocks are deleted, with a timeout
#         while True:
#             elapsed_time = time.time() - start_time
#             if elapsed_time > timeout:
#                 print("Timeout reached. Exiting loop. Not all blocks have been cleared.")
#                 break
#
#             remaining_blocks = self.notion.blocks.children.list(self.page)
#             for block in remaining_blocks:
#                 time.sleep(1)
#                 continue
#
#             print("All blocks deleted. Exiting loop.")
#             break
#
#         with open(md_file_path, "r", encoding="utf-8") as mdFile:
#             lastLine = ""
#             table = None
#             content = None
#             for line in mdFile:
#                 line = line.strip()
#                 if line.startswith("|"):
#                     if not lastLine.startswith("|"):
#                         headers = line.split("|")
#                         headers = list(filter(None, headers))
#                         table = blocks.Table[blocks.TableRow[headers]]
#                     else:
#                         row = line.split("|")
#                         row = list(
#                             map(lambda item: item.replace('-', ''), row))
#                         row = list(filter(None, row))
#                         if len(row) > 0:
#                             table.append(blocks.TableRow[row])
#                 elif line.startswith("###"):
#                     content = blocks.Heading3[line.replace("###", "", 1)]
#                 elif line.startswith("##"):
#                     content = blocks.Heading2[line.replace("##", "", 1)]
#                 elif line.startswith("#"):
#                     content = blocks.Heading1[line.replace("#", "", 1)]
#                 elif line.startswith("-"):
#                     content = blocks.BulletedListItem[line.replace("-", "", 1)]
#                 else:
#                     content = blocks.Paragraph[line]
#
#                 if table is not None and not line.startswith("|"):
#                     self.notion.blocks.children.append(self.page, table)
#                     table = None
#                 if content is not None:
#                     self.notion.blocks.children.append(self.page, content)
#                     content = None
#
#                 lastLine = line
#
#         if table is not None:
#             self.notion.blocks.children.append(self.page, table)
#         if content is not None:
#             self.notion.blocks.children.append(self.page, content)
#
#     def sync_from_notion(self, path: str = os.path.join(ROOT_DIR), doc_name: str = "PRDDocument"):
#         # MarkdownExporter will make markdown file on your output path
#         MarkdownExporter(block_id=PAGE_ID, output_path=path, download=True, unzipped=True, output_filename= doc_name).export()
#
#
# # # Test will remove later
# # actions = NotionActions()
# # #actions.process_markdown_and_upload(os.path.join(ROOT_DIR, "PRDDocument.md"))
# # actions.sync_from_notion()
