from graphene import String, List, Field
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
    songs = List(SongType)

    def resolve_playlist(self, info, **kwargs):
        persistent_id = kwargs.get("persistent_id")

        if persistent_id is not None:
            return Playlist.objects.get(persistent_id=persistent_id)

    def resolve_playlists(self, info, **kwargs):
        return Playlist.objects.all()

    def resolve_song(self, info, **kwargs):
        persistent_id = kwargs.get("persistent_id")

        if persistent_id is not None:
            return Song.objects.get(persistent_id=persistent_id)

    def resolve_songs(self, info, **kwargs):
        return Song.objects.select_related("album").all()
