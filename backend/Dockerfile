# Use official Python image
FROM python:3.11-slim AS base

# Set working directory
WORKDIR /app

COPY backend/ /app

# Install system dependencies, including ffmpeg
RUN apt-get update

# Download and extract dockerize with better error handling
RUN  apt-get install -y curl && curl -fsSL -o dockerize.tar.gz https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
  && tar -xzf dockerize.tar.gz -C /usr/local/bin \
  && rm dockerize.tar.gz

RUN apt-get install -y ffmpeg gcc libffi-dev libssl-dev && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS test
CMD ["pytest -v"]

