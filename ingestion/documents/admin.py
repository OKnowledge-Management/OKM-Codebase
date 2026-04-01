from django.contrib import admin

from .models import UploadedDocument


@admin.register(UploadedDocument)
class UploadedDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'original_filename', 'mime_type', 'status', 'progress', 'created_at')
    search_fields = ('id', 'original_filename', 'task_id')
    list_filter = ('status', 'mime_type', 'created_at')
    readonly_fields = ('id', 'created_at', 'updated_at', 'started_at', 'completed_at')
