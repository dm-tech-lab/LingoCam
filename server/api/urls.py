from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("qa/", include("qa.urls")),
    path("ocr/", include("ocr.urls")),
    path("auth/", include("auth.urls")),
]
