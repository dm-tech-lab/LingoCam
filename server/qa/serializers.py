from rest_framework import serializers

class QASerializer(serializers.Serializer):
    question = serializers.CharField(max_length=1028)
    