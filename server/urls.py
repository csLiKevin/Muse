from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("music.urls")),
    re_path(r"^(.*/|)$", TemplateView.as_view(template_name="client/index.html")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
