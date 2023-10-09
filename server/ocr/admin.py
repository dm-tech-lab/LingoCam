from .models import *
from django.contrib import admin


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = ("text", "result", "user")
    list_filter = ("created", "updated", "user")
    search_fields = ("text", "result", "user__username")
