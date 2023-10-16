# Use an official Python runtime as the parent image
FROM python:3.11.5-bullseye

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory (where the Dockerfile is) into the container at /app
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Redis
RUN apt-get update && apt-get install -y redis-server && apt-get clean

# Expose ports
EXPOSE 8000 6379

RUN chmod -R 777 /app/localstorage

# Start processes
CMD export PYTHONPATH=$PYTHONPATH:$(git rev-parse --show-toplevel)/ && service redis-server start && celery -A solidgpt.src.api.celery_tasks worker --loglevel=info --detach && uvicorn solidgpt.src.api.api:app --proxy-headers --host 0.0.0.0 --port 8000