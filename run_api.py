import uvicorn
import threading
import solidgpt.src.api.api
import celery.fixups
import kombu.transport.sqlalchemy
import celery.fixups.django
import celery.app.amqp
import celery.backends
import celery.backends.redis

from celery import Celery

# PyInstaller friendly imports --start--
import celery.app.amqp
import celery.app.log
import celery.worker.autoscale
import celery.worker.components
import celery.bin
import celery.utils
import celery.utils.dispatch
import celery.contrib.testing
import celery.utils.static
import celery.concurrency.prefork
import celery.app.events
import celery.events.state
import celery.app.control
import celery.backends.redis
import celery.backends
import celery.backends.database
import celery.worker
import celery.worker.consumer
import celery.app
import celery.loaders
import celery.security
import celery.fixups
import celery.concurrency
import celery.concurrency.thread
import celery.events
import celery.contrib
import celery.apps
import celery
import celery.fixups
import celery.fixups.django
import celery.apps.worker
import celery.worker.strategy
import kombu.transport.redis
import sqlalchemy.sql.default_comparator               
import sqlalchemy.ext.baked
import subprocess
import platform


if __name__ == "__main__":
    # Define the Celery command as a list of strings
    celery_command = []
    if platform.system() == 'Windows':
        celery_command = [
            'celery',
            '-A',
            'solidgpt.src.api.celery_tasks',
            'worker',
            '--loglevel=info',
            '-P',
            'eventlet'
        ]
    else:
        celery_command = [
            'celery',
            '-A',
            'solidgpt.src.api.celery_tasks',
            'worker',
            '--loglevel=info'
        ]

    # Start the Celery worker process in the background
    #celery_process = subprocess.Popen(celery_command)
    # Run your UVicorn server
    uvicorn.run("solidgpt.src.api.api:app", port=8000)