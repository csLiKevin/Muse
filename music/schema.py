from django.core.paginator import Paginator, EmptyPage
from graphene import String, List, Field, Int
from graphene_django import DjangoObjectType

from music.models import Song, Playlist, Album


class AlbumType(DjangoObjectType):
    class Meta:
        model = Album
        only_fields = ("artist", "image", "name")

    def resolve_image(self, info):
        return self.image and self.image.url


class PlaylistType(DjangoObjectType):
    class Meta:
        model = Playlist
        only_fields = ("name", "persistent_id", "songs")


class SongType(DjangoObjectType):
    class Meta:
        model = Song
        only_fields = ("album", "artist", "file", "name", "persistent_id")

    def resolve_file(self, info):
        return self.file and self.file.url


class MusicQuery(object):
    playlist = Field(PlaylistType, persistent_id=String())
    playlists = List(PlaylistType)
    song = Field(SongType, persistent_id=String())
    song_count = Int()
    songs = List(SongType, page=Int(), page_size=Int())

    def resolve_playlist(self, persistent_id=None):
        if persistent_id is not None:
            return Playlist.objects.get(persistent_id=persistent_id)

    def resolve_playlists(self, info):
        return Playlist.objects.order_by("pk").all()

    def resolve_song(self, info, persistent_id=None):
        if persistent_id is not None:
            return Song.objects.get(persistent_id=persistent_id)

    def resolve_song_count(self, info):
        return Song.objects.count()

    def resolve_songs(self, info, page=None, page_size=48):
        songs = Song.objects.select_related("album").order_by("pk").all()
        if page is None:
            return songs
        paginator = Paginator(songs, page_size)
        try:
            return paginator.page(page)
        except EmptyPage:
            return paginator.page(paginator.num_pages)
