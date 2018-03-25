from rest_framework.generics import ListAPIView, RetrieveAPIView, get_object_or_404
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


class Album(RetrieveAPIView):
    queryset = AlbumModel.objects.all()
    serializer_class = AlbumSerializer

    def get_object(self):
        queryset = self.get_queryset()
        artist = self.kwargs.get("artist")
        name = self.kwargs.get("name")

        return get_object_or_404(queryset, artist=artist, name=name)


class Song(RetrieveAPIView):
    lookup_field = "persistent_id"
    queryset = SongModel.objects.all()
    serializer_class = SongSerializer


class SongList(ListAPIView):
    pagination_class = ClassicPagination
    queryset = SongModel.objects.all()
    serializer_class = SongSerializer
