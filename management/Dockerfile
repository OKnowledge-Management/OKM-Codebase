FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

RUN python -m pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir Django==6.0.3

COPY --chown=app:app . /app

USER app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
