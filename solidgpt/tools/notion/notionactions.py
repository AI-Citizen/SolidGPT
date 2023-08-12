from solidgpt.request.notion_createpage_request import NotionCreatePageRequest, build_page_data


def create_page():
    req = NotionCreatePageRequest(build_page_data())
    req.call()
    return req.response