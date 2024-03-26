def response_upload(message="", status="", progress="", error=""):
    if progress == "":
        progress = {}
    return {
        "message": message,
        "status": status,
        "progress": progress,
        "error": error,
    }


def response_serverless(message="", status="", error=""):
    return {
        "message": message,
        "status": status,
        "error": error,
    }


def response_graph(graph="", message="", status="", progress="", error="", result="", extra_payload=None):
    if progress == "":
        progress = {}
    return {
        "graph": graph,
        "message": message,
        "status": status,
        "progress": progress,
        "error": error,
        "result": result,
        "payload": extra_payload,
    }