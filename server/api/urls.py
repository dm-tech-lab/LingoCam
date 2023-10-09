from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("", include("ocr.urls")),
    path("admin/", admin.site.urls),
    path("auth/", include("auth.urls")),
]
