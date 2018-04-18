from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ModelSerializer

from music.models import Song as SongModel, Album as AlbumModel


class ClassicPagination(PageNumberPagination):
    max_page_size = 100
    page_size = 24
    page_size_query_param = "page_size"


class AlbumSerializer(ModelSerializer):
    class Meta:
        model = AlbumModel
        fields = ("artist", "image", "name")
        read_only_fields = fields


class SongSerializer(ModelSerializer):
    album = AlbumSerializer()

    class Meta:
        model = SongModel
        fields = ("album", "artist", "file", "name", "persistent_id")
        read_only_fields = fields


class AlbumList(ListAPIView):
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("artist", "name")
    pagination_class = ClassicPagination
    queryset = AlbumModel.objects.order_by("name").all()
    serializer_class = AlbumSerializer


class SongList(ListAPIView):
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("persistent_id",)
    pagination_class = ClassicPagination
    queryset = SongModel.objects.order_by("name").all()
    serializer_class = SongSerializer
