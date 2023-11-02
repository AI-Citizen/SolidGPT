# run uvicorn solidgpt.src.api.api:app --reload
import logging
import uuid
from pydantic import BaseModel
from solidgpt.src.api.api_response import *
from solidgpt.src.manager.initializer import Initializer
from fastapi import FastAPI, UploadFile, File, HTTPException, Body, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # Import the CORSMiddleware
import shutil
from pathlib import Path

from solidgpt.src.orchestration.orchestration import Orchestration
from solidgpt.src.util.util import *
from solidgpt.src.workgraph.graph import *
from solidgpt.src.workgraph.graph_helper import GraphType, GraphStatus

from solidgpt.src.api.celery_tasks import *  # Import task function


class GraphResult:
    __result = None
    __graph_name = ""

    def __init__(self, result, graph_name):
        self.__result = result
        self.__graph_name = graph_name
        return

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


@app.post("/onboardrepo")
async def onboard_repo(body: dict = Body(...)):
    # Enqueue the background task: onboard repo
    logging.info("celery task: onboard repo graph")
    graph_id = str(uuid.uuid4())
    upload_id = body['upload_id']
    openai_key = body['openai_key']
    result = celery_task_onboard_repo_graph.apply_async(args=[openai_key, upload_id, graph_id])
    graph_result = GraphResult(result, "Onboard Repo Graph")
    graph_result_map[graph_id] = graph_result
    return JSONResponse(content={
        "message": f"Onboarding repo...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "onboard repo"
    }, status_code=200)


@app.post("/prd")
async def generate_prd(body: dict = Body(...)):
    # Enqueue the background task: prd
    logging.info("celery task: prd graph")
    new_graph_id = str(uuid.uuid4())
    onboarding_id = body['onboarding_id']
    current_graph_id = body['current_graph_id']
    if not current_graph_id or current_graph_id not in graph_result_map or current_graph_id not in graph_stage_map:
        current_graph_id = new_graph_id
        graph_stage_map[current_graph_id] = 0
    openai_key = body['openai_key']
    requirement = body['requirement']
    edit_content = body['edit_content']
    project_additional_info = body['project_additional_info']
    graph_stage = graph_stage_map.get(current_graph_id, 0)
    if graph_stage < 2:
        result = celery_task_prd_graph.apply_async(args=[
            openai_key, requirement, project_additional_info, onboarding_id, graph_stage, edit_content,
            current_graph_id])
        graph_result = GraphResult(result, "PRD Graph")
        graph_result_map[current_graph_id] = graph_result

        graph_stage_map[current_graph_id] = graph_stage + 1
        if graph_stage_map[current_graph_id] == 1:
            return JSONResponse(content={
                "message": f"Running prd graph...",
                "graph_id": current_graph_id,
                "is_final": False,
                "current_work_name": "write prd step 1"
            }, status_code=200)
        else:
            return JSONResponse(content={
                "message": f"Running prd graph...",
                "graph_id": current_graph_id,
                "is_final": True,
                "current_work_name": "write prd step 2"
            }, status_code=200)

    return JSONResponse(content={
        "message": f"Cannot run prd graph, the graph has already completed",
        "graph_id": current_graph_id,
        "is_final": True,
        "current_work_name": "write prd"
    }, status_code=200)


@app.post("/techsolution")
async def generate_tech_solution(body: dict = Body(...)):
    # Enqueue the background task: tech solution
    logging.info("celery task: tech solution graph")
    graph_id = str(uuid.uuid4())
    onboarding_id = body['onboarding_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    result = celery_task_tech_solution_graph.apply_async(args=[
        openai_key, requirement, onboarding_id, graph_id])
    graph_result = GraphResult(result, "Tech Solution Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running tech solution graph...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "tech solution"
    }, status_code=200)


@app.post("/repochat")
async def repo_chat(body: dict = Body(...)):
    # Enqueue the background task: repo chat
    logging.info("celery task: repo chat graph")
    graph_id = str(uuid.uuid4())
    onboarding_id = body['onboarding_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    result = celery_task_repo_chat_graph.apply_async(args=[
        openai_key, requirement, onboarding_id, graph_id])
    graph_result = GraphResult(result, "Repo chat Graph")
    graph_result_map[graph_id] = graph_result

    return JSONResponse(content={
        "message": f"Running repo chat graph...",
        "graph_id": graph_id,
        "is_final": True,
        "current_work_name": "repo chat"
    }, status_code=200)


@app.post("/autogenanalysis")
async def autogen_analysis(body: dict = Body(...)):
    # Enqueue the background task: autogen analysis
    logging.info("celery task: autogen analysis graph")

    onboarding_id = body['onboarding_id']
    openai_key = body['openai_key']
    requirement = body['requirement']
    task_id = body['task_id']
    is_new_session = int(body['is_new_session'])

    if is_new_session:
        graph_id = str(uuid.uuid4())
        result = celery_task_autogen_analysis_graph.apply_async(args=[
            openai_key, requirement, onboarding_id, graph_id])
        task_id = result.id
        autogen_task_map[task_id] = result
        return JSONResponse(content={
            "message": f"New autogen analysis graph...",
            "task_id": task_id,
            "is_final": True,
            "status": 1,
            "current_work_name": "autogen analysis"
        }, status_code=200)
    else:
        task = autogen_task_map.get(task_id)
        if task is None:
            return JSONResponse(content={
                "message": f"Invalid Autogen Analysis graph.",
                "task_id": task_id,
                "is_final": True,
                "status": 2,
                "current_work_name": "autogen analysis"
            }, status_code=200)
        redis_instance.lpush(task_id, requirement)
        return JSONResponse(content={
            "message": f"Continuing autogen analysis graph...",
            "task_id": task_id,
            "is_final": True,
            "status": 3,
            "current_work_name": "autogen analysis"
        }, status_code=200)


@app.post("/uploadrepo")
async def upload_repo(body: dict = Body(...)):
    # Store the file to local storage
    upload_id = f'uploadrepo-{str(uuid.uuid4())}'
    file_contents = body.get("file_contents", [])
    file_names = body.get("file_names", [])
    result = celery_task_upload_repo.apply_async(args=[upload_id, file_contents, file_names])
    uploaded_repo_map[upload_id] = result

    return JSONResponse(content={
        "message": f"Uploading files...",
        "upload_id": upload_id
    }, status_code=200)


@app.post("/status/autogen")
async def get_autogen_status(body: dict = Body(...)):
    task_id: str = body['task_id']
    celery_task_result = autogen_task_map.get(task_id)

    if celery_task_result is None:
        return JSONResponse(content={
            "message": "status: Error, not exist or not started",
            "task_id": task_id,
            "status": 1,
            "result": ""
        }, status_code=200)
    if celery_task_result.ready():
        return JSONResponse(content={
            "message": "Status: Current session is over, chat to start a new session",
            "task_id": task_id,
            "status": 2,
            "result": ""
        }, status_code=200)
    return JSONResponse(content={
        "message": "status: autogen task result",
        "task_id": task_id,
        "status": 3,
        "result": celery_task_result.info
    }, status_code=200)


@app.post("/status/upload")
async def get_upload_status(body: dict = Body(...)):
    repo_upload_id: str = body['upload_id']
    celery_task_result = uploaded_repo_map.get(repo_upload_id, None)

    if celery_task_result is None:
        return JSONResponse(content=response_upload(
                                message="status: not exist or not started",
                                status=1
                            ), status_code=200)
    if celery_task_result.ready():
        if celery_task_result.status == "SUCCESS":
            return JSONResponse(content=response_upload(
                message="status: uploaded",
                status=2
            ), status_code=200)
        elif celery_task_result.status == "FAILURE":
            return JSONResponse(content=response_upload(
                message="status: failed",
                status=4,
                error=celery_task_result.traceback
            ), status_code=200)
        else:
            return JSONResponse(content=response_upload(
                message="status: unknown",
                status=5
            ), status_code=200)
    return JSONResponse(content=response_upload(
        message="status: uploading",
        status=3,
        progress=celery_task_result.info
    ), status_code=200)


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
            result_txt = result.get()
            return JSONResponse(content=response_graph(
                graph=graph_result.get_name(),
                message=f"Graph finishes running.",
                status=2,
                result=result_txt,
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
