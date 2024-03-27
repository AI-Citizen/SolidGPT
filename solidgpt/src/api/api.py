## api.py
import asyncio
import logging
import uuid
from pydantic import BaseModel
from solidgpt.src.api.api_response import *
from solidgpt.src.manager.initializer import Initializer
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Import the CORSMiddleware
from celery.result import allow_join_result
from solidgpt.src.util.util import *
from solidgpt.src.workgraph.graph import *
import os
from solidgpt.src.api.celery_tasks import *  # Import task function


class GraphResult:
    __result = None
    __graph_name = ""

    def __init__(self, result, graph_name):
        self.set_result_obj(result)
        self.__graph_name = graph_name

    def set_result_obj(self, result_obj):
        self.__result = result_obj

    def get_result_obj(self):
        return self.__result

    def get_name(self):
        return self.__graph_name

    def set_name(self, new_name):
        self.__graph_name = new_name


app = FastAPI()

# Add the CORS middleware with the allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later change this to "origins"
    allow_credentials=True,
    allow_methods=["*"],  # You can restrict this to specific HTTP methods if needed
    allow_headers=["*"],  # You can restrict this to specific headers if needed
)

Initializer()
# orchestration = Orchestration()
uploaded_repo_map: dict = {}
autogen_task_map: dict = {}
graph_result_map: dict[str, GraphResult] = {}
graph_stage_map: dict = {}
serverless_task_map: dict = {}


class FileData(BaseModel):
    file_contents: list[str]
    filenames: list[str]


@app.get("/test/getmsg")
async def test_get():
    return JSONResponse(content={"message": f"[Test Get] Message 'Hello World!'."}, status_code=200)


@app.post("/test/postmsg")
async def test_post(body: dict = Body(...)):
    return JSONResponse(content={"message": f"[Test Post] Message '{body['msg']}'."}, status_code=200)


@app.post("/remove/files")
async def remove_all_files():
    try:
        # Remove existing files
        delete_directory_contents(REPO_STORAGE_DIR)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")

    return JSONResponse(content={"message": f"All files removed"}, status_code=200)

@app.post("/status/graph")
async def get_graph_status(body: dict = Body(...)):
    result = await get_graph_status_impl(body)
    return result

async def get_graph_status_impl(body: dict = Body(...)):
    graph_id = body['graph_id']
    graph_result = graph_result_map.get(graph_id, None)
    result = None
    if graph_result is not None:
        result = graph_result.get_result_obj()

    if graph_result is None:
        return JSONResponse(content=response_graph(
            message=f"Graph does not exist.",
            status=0,
        ), status_code=200)
    elif not result.ready():
        return JSONResponse(content=response_graph(
            graph=graph_result.get_name(),
            message=f"Graph is still executing.",
            status=1,
            progress=result.info,
        ), status_code=200)
    elif result.ready():
        if result.status == "SUCCESS":
            result_txt = ""
            extra_payload = None
            with allow_join_result():
                result_obj = result.get()
                if isinstance(result_obj, str):
                    result_txt = result_obj
                elif isinstance(result_obj, list):
                    if len(result_obj) >= 1:
                        result_txt = result_obj[0]
                    if len(result_obj) >= 2:
                        extra_payload = result_obj[1]
            return JSONResponse(content=response_graph(
                graph=graph_result.get_name(),
                message=f"Graph finishes running.",
                status=2,
                result=result_txt,
                extra_payload=extra_payload,
            ), status_code=200)
        elif result.status == "FAILURE":
            return JSONResponse(content=response_graph(
                graph=graph_result.get_name(),
                message=f"Graph has an error.",
                status=4,
                error=result.traceback,
            ), status_code=200)
    return JSONResponse(content=response_graph(
        graph=graph_result.get_name(),
        message=f"Graph in unknown state.",
        status=3,
    ), status_code=200)

@app.post("/repochat/v2")
async def repo_chat_v2(body: dict = Body(...)):
    # Enqueue the background task: repo chat
    try:
        logging.info("celery task: repo chat graph")
        session_id = body['session_id']
        openai_key = body['openai_key']
        requirement = body['requirement']
        logging.info("celery task: repo chat graph")
        openai.api_key = openai_key
        g = build_repo_chat_graph_v2(requirement, session_id)
        g.init_node_dependencies()
        g.execute()
        result = g.display_result.get_result()

        return JSONResponse(content={
            "message": f"Running repo chat graph...",
            "session_id": session_id,
            "result": result,
            "status": "Succeeded"
        }, status_code=200)
    except Exception as e:
        session_id = body.get('session_id', "")
        return JSONResponse(content={
            "message": f"Running repo chat graph...",
            "session_id": session_id,
            "result": str(e),
            "status": "Failed"
        }, status_code=200)

@app.post("/onboardrepo/v4")
async def onboard_repo_v4(body: dict = Body(...)):
    # Enqueue the background task: onboard repo
    logging.info("celery task: onboard repo graph")
    # TODO: Remove graph_id in the future
    graph_id = f'placeholder'
    openai_key = body['openai_key']
    base_path = body['base_path']
    # logging.info(f"onboard_repo_v4: {base_path}")
    result = celery_task_onboard_repo_graph_v4.apply_async(args=[openai_key, graph_id, base_path])
    graph_result = GraphResult(result, "Onboard Repo Graph")
    graph_result_map[graph_id] = graph_result
    return JSONResponse(content={
        "message": f"Indexing codebase...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "onboard repo"
    }, status_code=200)

@app.post("/codeplan/v4")
async def code_plan_v4(body: dict = Body(...)):
    # Enqueue the background task: code plan
    logging.info("celery task: code plan graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    logging.info("celery task: code plan graph")
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    result = celery_task_code_plan_graph_v4.apply_async(args=[openai_key, requirement, graph_id])
    graph_result = GraphResult(result, "Code Plan Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running code plan graph...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "code plan"
    }, status_code=200)

@app.post("/codesolution/v3")
async def code_solution_v3(body: dict = Body(...)):
    # Enqueue the background task: code plan
    logging.info("celery task: code solution graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    code_plan = body['code_plan']
    # If user input the openai model, set it as default for most of the skills
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])

    logging.info("celery task: code solution graph")
    openai.api_key = openai_key
    result = celery_task_code_solution_graph_v3.apply_async(args=[openai_key, requirement, code_plan, graph_id])
    graph_result = GraphResult(result, "Code Solution Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running tech solution graph...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "tech solution"
    }, status_code=200)

@app.post("/serverless/deploy")
async def deploy_serverless(body: dict = Body(...)):
    task_id = f'deploy-{str(uuid.uuid4())}'
    session_id = body.get("session_id", "")
    yml_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id, "architecture", "serverless.yml")
    aws_key_id = body.get("aws_key_id", "")
    aws_access_key = body.get("aws_access_key", "")
    result = celery_task_serverless_deploy.apply_async(args=[yml_path, aws_key_id, aws_access_key])
    serverless_task_map[task_id] = result

    return JSONResponse(content={
        "message": f"Deploying to AWS...",
        "task_id": task_id
    }, status_code=200)


@app.post("/serverless/remove")
async def remove_serverless(body: dict = Body(...)):
    task_id = f'remove-{str(uuid.uuid4())}'
    session_id = body.get("session_id", "")
    yml_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, session_id, "architecture", "serverless.yml")
    aws_key_id = body.get("aws_key_id", "")
    aws_access_key = body.get("aws_access_key", "")
    result = celery_task_serverless_remove.apply_async(args=[yml_path, aws_key_id, aws_access_key])
    serverless_task_map[task_id] = result

    return JSONResponse(content={
        "message": f"Removing from AWS...",
        "task_id": task_id
    }, status_code=200)


@app.post("/status/serverless")
async def get_serverless_task_status(body: dict = Body(...)):
    task_id: str = body['task_id']
    celery_task_result = serverless_task_map.get(task_id, None)

    if celery_task_result is None:
        return JSONResponse(content=response_serverless(
                                message="status: not exist or not started",
                                status="Failed"
                            ), status_code=200)
    if celery_task_result.ready():
        if celery_task_result.status == "SUCCESS":
            res_dict = celery_task_result.info
            if res_dict.get("status", "Failed") == "Succeeded":
                return JSONResponse(content=response_serverless(
                    message="status: succeeded",
                    status="Succeeded"
                ), status_code=200)
            else:
                return JSONResponse(content=response_serverless(
                    message="status: " + str(res_dict.get("status", "Failed")),
                    status="Failed",
                    error=res_dict.get("output", "no error output")
                ), status_code=200)
        elif celery_task_result.status == "FAILURE":
            return JSONResponse(content=response_serverless(
                message="status: failed due to an unexpected error",
                status="Failed",
                error=celery_task_result.traceback
            ), status_code=200)
        else:
            return JSONResponse(content=response_serverless(
                message="status: unknown",
                status="Failed"
            ), status_code=200)
    return JSONResponse(content=response_upload(
        message="status: executing serverless...",
        status="Running",
        progress=celery_task_result.info
    ), status_code=200)

@app.post("/selecttemplate")
async def select_template(body: dict = Body(...)):
    # Enqueue the background task: code plan
    logging.info("celery task: select template graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    logging.info("celery task: select template")
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    result = celery_task_select_template.apply_async(args=[openai_key, requirement, graph_id])
    graph_result = GraphResult(result, "Select Template Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running Select Template graph...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "Select Template"
    }, status_code=200)

@app.post("/httpsolution/v1")
async def http_solution_v1(body: dict = Body(...)):
    logging.info("celery task: http solution graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    logging.info("celery task: http solution v1")
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    result = celery_task_http_solution.apply_async(args=[openai_key, requirement, graph_id])
    graph_result = GraphResult(result, "HTTP Solution Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running HTTP Solution graph...",
        "graph_id": graph_id,
        "is_final": True,
        "path": result,
        "current_work_name": "HTTP Solution"
    }, status_code=200)


@app.post("/notionembed")
async def notion_embed(body: dict = Body(...)):
    logging.info("celery task: notion embed")
    # TODO: Remove graph_id in the future
    graph_id = f'placeholder'
    onboarding_id = body['onboarding_id']
    openai_key = body['openai_key']
    workspace_token = body['workspace_token']
    page_id = body['top_level_page_id']
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    result = celery_task_notion_embed.apply_async(args=[openai_key, onboarding_id, workspace_token, page_id])
    graph_result = GraphResult(result, "Notion Embed Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Indexing Notion workspace...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "Notion Embed"
    }, status_code=200)

@app.post("/codechatapi")
async def codechatapi(body: dict = Body(...)):
    logging.info("celery task: code chat api graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    scope = body['scope']
    logging.info("celery task: code chat api")
    if len(scope) > 5:
        logging.info("can only refer to 5 files, using top five files listed")
        scope = scope[:5]
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    try:
        code_result = None
        code_scope = []
        for path in scope:
            if path[:9] == "codebase/":
                code_scope.append(path)
        code_result = celery_task_code_chat.apply_async(args=[openai_key, requirement, graph_id, code_scope])
        code_graph_graph_result = GraphResult(code_result, "code chat api Graph")
        graph_result_map[graph_id] = code_graph_graph_result

        return JSONResponse(content={
            "message": f"I am thinking...",
            "graph_id": graph_id,
            "is_final": True,
            "status": "Succeeded",
            "current_work_name": "chat api"
        }, status_code=200)
    except Exception as e:
        session_id = body.get('session_id', "")
        return JSONResponse(content={
            "message": f"Running celery task: chat api...",
            "session_id": session_id,
            "result": str(e.with_traceback()),
            "status": "Failed"
        }, status_code=200)

@app.post("/notionchatapi")
async def notionchatapi(body: dict = Body(...)):
    logging.info("celery task: notion chat api graph")
    graph_id = body['graph_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    scope = body['scope']
    logging.info("celery task: notion chat api")
    if len(scope) > 5:
        logging.info("can only refer to 5 files, using top five files listed")
        scope = scope[:5]
    openai.api_key = openai_key
    if 'openai_model' in body:
        ConfigReader().set_default_openai_model(body['openai_model'])
    try:
        notion_result = None
        notion_scope = []
        for path in scope:
            if path[:7] == "notion/":
                notion_scope.append(path)
        notion_result = celery_task_notion_chat.apply_async(args=[openai_key, requirement, graph_id, notion_scope])
        notion_graph_graph_result = GraphResult(notion_result, "notion chat api Graph")
        graph_result_map[graph_id] = notion_graph_graph_result

        return JSONResponse(content={
            "message": f"I am thinking...",
            "graph_id": graph_id,
            "is_final": True,
            "status": "Succeeded",
            "current_work_name": "chat api"
        }, status_code=200)
    except Exception as e:
        session_id = body.get('session_id', "")
        return JSONResponse(content={
            "message": f"Running celery task: chat api...",
            "session_id": session_id,
            "result": str(e.with_traceback()),
            "status": "Failed"
        }, status_code=200)
    
@app.post("/clean/chat")
async def clean_chat_history():
    # Implement the logic to clean the chat history here
    file_path = os.path.join(LOCAL_STORAGE_OUTPUT_DIR, "placeholder", "placeholder_chat.json")
    try:
        os.remove(file_path)
        logging.info("File deleted successfully.")
    except OSError as e:
        logging.warn(f"Error deleting the file: {e}")
        return JSONResponse(content={"message": f"Error deleting the file: {e}"}, status_code=200)
    return JSONResponse(content={"message": "Chat history cleaned successfully."}, status_code=200)

