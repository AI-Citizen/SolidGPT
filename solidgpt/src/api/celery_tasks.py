import base64
import threading
import uuid

from celery import Celery
from celery.apps.worker import Worker

from pathlib import Path
from solidgpt.src.configuration.configreader import ConfigReader

from solidgpt.src.constants import *
from solidgpt.src.util.util import *
from solidgpt.src.workgraph.graph import *
from solidgpt.src.manager.initializer import *
import redis
import os
import subprocess

use_redis = False

if use_redis:
    app = Celery('celery_tasks',
                 BROKER_URL='redis://localhost:6379/0',  # Using Redis as the broker
                 CELERY_RESULT_BACKEND='redis://localhost:6379/1'
                 )
else:
    app = Celery('celery_tasks',
                 broker='sqla+sqlite:///celerydb.sqlite',
                 CELERY_RESULT_BACKEND='db+sqlite:///results.db'
                 )

app.autodiscover_tasks(['solidgpt.src.api'])
if use_redis:
    redis_instance = redis.Redis()
Initializer()


def start_celery():
    app.worker_main(['worker', '--loglevel=info', '--concurrency=1', '--pool=threads'])


celery_thread = threading.Thread(target=start_celery)
celery_thread.daemon = True  # Set the thread as a daemon thread
celery_thread.start()


@app.task
def hello_world():
    logging.info("hello repo!")
    print("hello repo!")
    return "hello world"


@app.task(bind=True)
def celery_task_repo_chat_graph_v2(requirement, session_id):
    logging.info("celery task: repo chat graph")
    openai.api_key = ConfigReader.get_property('openai_api_key')
    g = build_repo_chat_graph_v2(requirement, session_id)
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_onboard_repo_graph_v4(self, openai_key, session_id, base_path):
    logging.info("celery task: tech solution graph")
    openai.api_key = openai_key
    # logging.info(f"base path:{base_path}")
    g = build_onboarding_graph_v4(session_id=session_id, base_path=base_path)

    def update_progress(current, total):
        self.update_state(
            state='PROGRESS',
            meta={'current': current, 'total': total}
        )

    g.callback_map[SKILL_NAME_VSCODE_EMBED2] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    extra_payload = g.display_result.get_custom_result()
    return [text_result, extra_payload]


@app.task(bind=True)
def celery_task_code_plan_graph_v4(self, openai_key, requirement, graph_id, summary):
    logging.info("celery task: tech solution graph")
    openai.api_key = openai_key
    g = build_code_plan_graph_v4(requirement, graph_id, summary)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_CREATE_CODE_PLAN] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_code_solution_graph_v3(self, openai_key, requirement, code_plan, graph_id):
    logging.info("celery task: tech solution graph")
    openai.api_key = openai_key
    g = build_code_solution_graph_v3(requirement, graph_id, code_plan)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_CREATE_CODE_SOLUTION] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


# Severless actions
@app.task(bind=True)
def celery_task_serverless_deploy(self, yml_path: str, aws_key_id: str, aws_access_key: str):
    logging.info("celery task: serverless deploy")

    # Extract the directory from the file path
    directory = Path(yml_path).parent

    # Set AWS credentials
    env = os.environ.copy()
    env['AWS_ACCESS_KEY_ID'] = aws_key_id
    env['AWS_SECRET_ACCESS_KEY'] = aws_access_key

    # Define the command to run
    command = ["serverless", "deploy", "--config", yml_path, "--verbose"]
    self.update_state(
        state='PROGRESS',
        meta={}
    )

    # Execute the command
    process = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=directory, env=env)

    # Check if the command was successful
    if process.returncode == 0:
        print("Deployment successful.")
        print("Output:\n", process.stdout)
        return {'status': 'Succeeded', 'message': 'Deployment successful.', 'output': process.stdout}
    else:
        print("Deployment failed.")
        print("Error:\n", process.stdout)
        return {'status': 'Failed', 'message': 'Deployment failed.', 'output': process.stdout}


@app.task(bind=True)
def celery_task_serverless_remove(self, yml_path: str, aws_key_id: str, aws_access_key: str):
    logging.info("celery task: serverless remove")

    # Extract the directory from the file path
    directory = Path(yml_path).parent

    # Set AWS credentials
    env = os.environ.copy()
    env['AWS_ACCESS_KEY_ID'] = aws_key_id
    env['AWS_SECRET_ACCESS_KEY'] = aws_access_key

    # Define the command to run
    command = ["serverless", "remove", "--config", yml_path, "--verbose"]
    self.update_state(
        state='PROGRESS',
        meta={}
    )

    # Execute the command
    process = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=directory, env=env)

    # Check if the command was successful
    if process.returncode == 0:
        print("Removal successful.")
        print("Output:\n", process.stdout)
        return {'status': 'Succeeded', 'message': 'Removal successful.', 'output': process.stdout}
    else:
        print("Removal failed.")
        print("Error:\n", process.stdout)
        return {'status': 'Failed', 'message': 'Removal failed.', 'output': process.stdout}


@app.task(bind=True)
def celery_task_select_template(self, openai_key, requirement, graph_id):
    logging.info("celery task: select_template")
    openai.api_key = openai_key
    g = build_select_template_graph(requirement, graph_id)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_SELECT_TEMPLATE] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_http_solution(self, openai_key, requirement, graph_id):
    logging.info("celery task: http solution")
    openai.api_key = openai_key
    g = build_http_solution_graph(requirement, graph_id)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_HTTP_SOLUTION] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_notion_embed(self, openai_key, onboarding_id, workspace_token, top_level_page_id):
    logging.info("celery task: notion embed")
    openai.api_key = openai_key
    g = build_notion_graph(onboarding_id=onboarding_id, workspace_token=workspace_token, page_id=top_level_page_id )
    def update_progress(current_status):
        self.update_state(
            state='PROGRESS',
            meta={'status': current_status}
        )
    g.callback_map[SKILL_NAME_NOTION_EMBED] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    extra_payload = g.display_result.get_custom_result()
    return [text_result, extra_payload]

@app.task(bind=True)
def celery_task_code_chat(self, openai_key, requirement, graph_id, scope):
    logging.info("celery task: code chat")
    openai.api_key = openai_key
    g = build_code_chat_graph(requirement, graph_id, scope)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_CODE_CHAT] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result


@app.task(bind=True)
def celery_task_notion_chat(self, openai_key, requirement, graph_id, scope):
    logging.info("celery task: notion chat")
    openai.api_key = openai_key
    g = build_notion_chat_graph(requirement, graph_id, scope)

    def update_progress(current_content):
        self.update_state(
            state='PROGRESS',
            meta={'current_content': current_content}
        )

    g.callback_map[SKILL_NAME_NOTION_CHAT] = update_progress
    g.init_node_dependencies()
    g.execute()
    text_result = g.display_result.get_result()
    return text_result
