#!/bin/bash

# Check if the OS is macOS
if [[ "$(uname)" == "Darwin" ]]; then
    # Check if the Redis service is running
    if ! pgrep redis-server > /dev/null; then
        # If not, start Redis service using Homebrew
        brew services start redis
    fi
    if pgrep redis-server > /dev/null; then
        brew services restart redis
    fi
fi
if [[ !"$(uname)" == "Darwin" ]]; then
    service redis-server start
fi
celery -A solidgpt.src.api.celery_tasks worker --loglevel=info --detach
uvicorn solidgpt.src.api.api:app --proxy-headers --host 0.0.0.0 --port 8000
