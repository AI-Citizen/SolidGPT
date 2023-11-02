# celery -A solidgpt.src.api.celery_tasks worker --loglevel=info -P eventlet
# celery_config.py

import os

BROKER_URL = os.getenv('BROKER_URL', 'redis://localhost:6379/0')  # Using Redis as the broker
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1')
