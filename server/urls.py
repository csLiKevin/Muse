from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^$", TemplateView.as_view(template_name="client/index.html")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
