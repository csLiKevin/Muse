from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import ModelSerializer

from music.models import Song, Album


class ClassicPagination(PageNumberPagination):
    max_page_size = 100
    page_size = 24
    page_size_query_param = "page_size"


class AlbumSerializer(ModelSerializer):
    class Meta:
        model = Album
        fields = ("artist", "image", "name")
        read_only_fields = fields


class SongSerializer(ModelSerializer):
    album = AlbumSerializer()

    class Meta:
        model = Song
        fields = ("album", "artist", "file", "name", "persistent_id")
        read_only_fields = fields


class SongList(ListAPIView):
    queryset = Song.objects.all()
    pagination_class = ClassicPagination
    serializer_class = SongSerializer
