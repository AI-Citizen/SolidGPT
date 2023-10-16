def response_upload(message="", status="", progress="", error=""):
    if progress == "":
        progress = {}
    return {
        "message": message,
        "status": status,
        "progress": progress,
        "error": error,
    }


def response_graph(graph="", message="", status="", progress="", error="", result=""):
    if progress == "":
        progress = {}
    return {
        "graph": graph,
        "message": message,
        "status": status,
        "progress": progress,
        "error": error,
        "result": result,
    }