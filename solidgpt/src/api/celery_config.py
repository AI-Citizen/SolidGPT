# celery -A solidgpt.src.api.celery_tasks worker --loglevel=info -P eventlet
# celery_config.py

BROKER_URL = 'redis://localhost:6379/0'  # Using Redis as the broker
CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
