from rest_framework import serializers

from .models import UploadedDocument


class UploadAcceptedSerializer(serializers.Serializer):
    document_id = serializers.UUIDField()
    task_id = serializers.CharField()
    status = serializers.CharField()
    progress = serializers.IntegerField()
    stage = serializers.CharField()


class UploadedDocumentStatusSerializer(serializers.ModelSerializer):
    document_id = serializers.UUIDField(source='id')
    filename = serializers.CharField(source='original_filename')
    message = serializers.SerializerMethodField()

    def get_message(self, obj):
        return self.context.get('message', '')

    class Meta:
        model = UploadedDocument
        fields = (
            'document_id',
            'task_id',
            'filename',
            'mime_type',
            'status',
            'progress',
            'stage',
            'error_message',
            'created_at',
            'updated_at',
            'completed_at',
            'message',
        )
