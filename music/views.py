from django_filters.rest_framework import CharFilter, DjangoFilterBackend, FilterSet
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


class SongFilter(FilterSet):
    album_artist = CharFilter(name="album__artist")
    album_name = CharFilter(name="album__name")

    class Meta:
        model = SongModel
        fields = ("album_artist", "album_name", "persistent_id",)


class SongList(ListAPIView):
    filter_backends = (DjangoFilterBackend,)
    filter_class = SongFilter
    pagination_class = ClassicPagination
    queryset = SongModel.objects.order_by("name").all()
    serializer_class = SongSerializer
