from .views import *
from django.urls import path


urlpatterns = [
    path("", TranslationView.as_view(), name="translation")
]