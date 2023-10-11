from .views import *
from django.urls import path


urlpatterns = [
    path("", QAView.as_view(), name="qa")
]