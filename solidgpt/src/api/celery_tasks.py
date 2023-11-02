import base64
import time
import uuid

from celery import Celery
import shutil
from pathlib import Path

from solidgpt.src.constants import *
from solidgpt.src.util.util import *
from solidgpt.src.workgraph.workgraph import WorkGraph
from solidgpt.src.worknode.worknode import WorkNode
from solidgpt.src.workskill.workskill import WorkSkill
from solidgpt.src.workskill.skills.load_repo import LoadRepo
from solidgpt.src.workgraph.graph import *
from solidgpt.src.manager.initializer import *
import redis

app = Celery('celery_tasks',
             BROKER_URL='redis://localhost:6379/0',  # Using Redis as the broker
             CELERY_RESULT_BACKEND='redis://localhost:6379/1'
             )
app.autodiscover_tasks(['solidgpt.src.api'])
redis_instance = redis.Redis()
Initializer()


@app.task
def hello_world():
    logging.info("hello repo!")
    print("hello repo!")
    return "hello world"


@app.task(bind=True)
def celery_task_upload_repo(self, repo_onboarding_id: str, file_contents: list, file_names: list):
    logging.info("celery task: upload repo")
    total = len(file_contents)
    cur = 0
    for file_content, file_name in zip(file_contents, file_names):
        cur += 1
        file_location = Path(LOCAL_STORAGE_OUTPUT_DIR) / repo_onboarding_id / file_name

        # Create the directory if it doesn't exist
        file_location.parent.mkdir(parents=True, exist_ok=True)

        # Decode the base64-encoded file content
        file_content_bytes = ""
        data_uri = file_content
        base64_content = data_uri.split(",")[1]
        try:
            file_content_bytes = base64.b64decode(base64_content)
        except Exception as e:
            pass

        # Save the file with the provided filename
        file_path = f"{LOCAL_STORAGE_OUTPUT_DIR}/{repo_onboarding_id}/{file_name}"
        with open(file_path, "wb") as file:
            file.write(file_content_bytes)

        self.update_state(
            state='PROGRESS',
            meta={'current': cur, 'total': total}
        )
    return True


@app.task(bind=True)
def celery_task_onboard_repo_graph(self, openai_key, upload_id, output_id):
    logging.info("celery task: onboard repo graph")
    openai.api_key = openai_key
    g = build_onboarding_graph(LOCAL_STORAGE_OUTPUT_DIR, output_id, upload_id, True)

    def update_progress(current, total):
        self.update_state(
            state='PROGRESS',
            meta={'current': current, 'total': total}
        )

    g.callback_map[SKILL_NAME_SUMMARY_FILE] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task
def celery_task_prd_graph(openai_key, requirement, project_additional_info, onborading_graph_id, stage, edit_content,
                          current_graph_id):
    logging.info("celery task: prd graph")
    openai.api_key = openai_key
    g = build_prd_graph_with_stage(requirement, project_additional_info, onborading_graph_id, stage, edit_content,
                                   current_graph_id)
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task
def celery_task_tech_solution_graph(openai_key, requirement, onboarding_id, graph_id):
    logging.info("celery task: tech solution graph")
    openai.api_key = openai_key
    g = build_tech_solution_graph(requirement, onboarding_id, graph_id)
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task
def celery_task_repo_chat_graph(openai_key, requirement, onboarding_id, graph_id):
    logging.info("celery task: repo chat graph")
    openai.api_key = openai_key
    g = build_repo_chat_graph(requirement, onboarding_id, graph_id)
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_autogen_analysis_graph(self, openai_key, requirement, onboarding_id, graph_id):
    logging.info("celery task: autogen analysis graph")
    self.update_state(
        state='PROGRESS',
        meta={'result': "", 'state_id': ""}
    )
    def autogen_message_input_callback():
        data = redis_instance.blpop(self.request.id)
        if data:
            # Extracting UUID and poem text from the tuple
            task_id, poem_bytes = data

            # Converting bytes to string
            poem_text = poem_bytes.decode()
            print(poem_text)  # for server debug
            return poem_text
        return ""

    def autogen_update_result_callback(result):
        self.update_state(
            state='PROGRESS',
            meta={'result': result, 'state_id': str(uuid.uuid4())}
        )

    openai.api_key = openai_key
    g = build_autogen_analysis_graph(requirement, onboarding_id, graph_id,
                                     autogen_message_input_callback, autogen_update_result_callback)
    g.init_node_dependencies()
    g.execute()

    return ""
