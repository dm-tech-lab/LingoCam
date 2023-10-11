from .models import *
from django.contrib import admin


@admin.register(QA)
class QAAdmin(admin.ModelAdmin):
    list_display = ("question", "context", "answer", "user")
    list_filter = ("created", "updated", "user")
    search_fields = ("question", "context", "answer", "user__username")
