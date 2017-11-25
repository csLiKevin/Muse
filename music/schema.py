from graphene import String, List, Field
from graphene_django import DjangoObjectType

from music.models import Song, Playlist


class SongType(DjangoObjectType):
    class Meta:
        model = Song
        only_fields = ("file", "name", "persistent_id")


class PlaylistType(DjangoObjectType):
    class Meta:
        model = Playlist
        only_fields = ("name", "persistent_id", "songs")


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
        return Song.objects.all()
