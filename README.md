# Project Structure and Run Guide

This repository contains 4 Django services and a root Docker Compose setup.

## Structure

- `ingestion/`
- `management/`
- `notification/`
- `rag/`
- `docker-compose.yml`

Each service folder has:

- `manage.py`
- `<service_name>/settings.py`
- `<service_name>/urls.py`
- `<service_name>/asgi.py`
- `<service_name>/wsgi.py`
- `Dockerfile`

## Ports

Docker Compose maps each service to a different host port:

- Ingestion: `http://localhost:8001`
- Management: `http://localhost:8002`
- Notification: `http://localhost:8003`
- RAG: `http://localhost:8004`

## Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

To run in detached mode:

```bash
docker compose up --build -d
```

To stop:

```bash
docker compose down
```

## Run a Single Service Without Docker

Example for `notification`:

```bash
cd notification
../okmenv/bin/python manage.py runserver 0.0.0.0:8000
```

Repeat the same pattern for `ingestion`, `management`, and `rag` by changing directories.
