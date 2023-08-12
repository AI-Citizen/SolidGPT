
from solidgpt.configuration.configreader import ConfigReader
from solidgpt.request.basic_request import BasicRequest, RequestMethod


class NotionCreatePageRequest(BasicRequest):
    def __init__(self, page_data: dict):
        notion_api_key = ConfigReader().get_property("notion_api_key")
        url = 'https://api.notion.com/v1/pages'
        method = RequestMethod.POST
        headers = {
            "Authorization": "Bearer " + notion_api_key,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
        }
        params = None
        data = page_data  # The data for creating a Notion page
        super().__init__(url, method, headers, params, data)


def build_page_data():
    return {
        "parent": {"page_id": ConfigReader().get_property("notion_page_id")},
        "icon": {"emoji": "🥬"},
        "cover": {
            "external": {
                "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
            }
        },
        "properties": {
            "title": {'id': 'title', 'type': 'title', 'title': [{
                "type": "text",
                "text": {
                    "content": "A better title for the page",
                    "link": None
                }}
            ]}},
        "children": [
            {
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": "You made this page using the Notion API. Pretty cool, huh? We hope you enjoy building with us."}}]
                }
            }
        ]
    }
