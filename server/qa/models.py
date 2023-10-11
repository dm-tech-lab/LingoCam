from uuid import uuid4
from django.db import models
from django.contrib.auth.models import User


class QA(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(auto_now=True, editable=False)
    question = models.TextField(null=False, blank=False)
    context = models.TextField(null=False, blank=False)
    answer = models.TextField(null=False, blank=False)
    
    def __str__(self) -> str:
        return self.question
