from __future__ import annotations

import asyncio

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import sync_to_async

from .models import UploadedDocument
from .services import sync_document_status


class UploadProgressConsumer(AsyncJsonWebsocketConsumer):
    POLL_INTERVAL_SECONDS = 1

    async def connect(self):
        self.document_id = self.scope['url_route']['kwargs']['document_id']
        self._poll_task = None

        exists = await sync_to_async(self._document_exists)()
        if not exists:
            await self.close(code=4404)
            return

        await self.accept()
        self._poll_task = asyncio.create_task(self._poll_status())

    async def disconnect(self, close_code):
        if self._poll_task:
            self._poll_task.cancel()
            try:
                await self._poll_task
            except asyncio.CancelledError:
                pass

    async def _poll_status(self):
        last_snapshot = None
        while True:
            snapshot = await sync_to_async(self._get_status_snapshot)()
            if snapshot != last_snapshot:
                await self.send_json(snapshot)
                last_snapshot = snapshot

            if snapshot['status'] in {UploadedDocument.Status.COMPLETED, UploadedDocument.Status.FAILED}:
                await self.close()
                return

            await asyncio.sleep(self.POLL_INTERVAL_SECONDS)

    def _document_exists(self) -> bool:
        return UploadedDocument.objects.filter(id=self.document_id).exists()

    def _get_status_snapshot(self) -> dict:
        try:
            document = UploadedDocument.objects.get(id=self.document_id)
        except ObjectDoesNotExist:
            return {
                'document_id': str(self.document_id),
                'status': UploadedDocument.Status.FAILED,
                'progress': 100,
                'stage': 'failed',
                'message': 'Document not found',
            }

        live = sync_document_status(document)
        return {
            'document_id': str(document.id),
            'task_id': document.task_id,
            'status': document.status,
            'progress': document.progress,
            'stage': document.stage,
            'message': live.get('message', ''),
            'error_message': document.error_message,
        }
