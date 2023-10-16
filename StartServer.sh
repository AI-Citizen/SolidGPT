#!/bin/bash

service redis-server start
celery -A solidgpt.src.api.celery_tasks worker --loglevel=info --detach
uvicorn solidgpt.src.api.api:app --proxy-headers --host 0.0.0.0 --port 8000
