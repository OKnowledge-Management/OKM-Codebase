from django.urls import path

from documents.consumers import UploadProgressConsumer

websocket_urlpatterns = [
    path('ws/uploads/<uuid:document_id>/', UploadProgressConsumer.as_asgi()),
]
