import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'workers.settings')

app = Celery('workers')

# Use CELERY_* keys from Django settings with the "CELERY" namespace.
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
