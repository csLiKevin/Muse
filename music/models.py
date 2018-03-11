from __future__ import unicode_literals

from hashlib import sha256
from os.path import splitext

from django.db.models import Model, FileField, CharField, ManyToManyField, ImageField, ForeignKey, CASCADE


def get_song_media_location(instance, filename):
    return "song/{}{}".format(instance.persistent_id, splitext(filename)[1])


def get_album_media_location(instance, filename):
    return "album_cover/{}{}".format(
        sha256("{}{}".format(instance.artist, instance.name).encode("utf-8")).hexdigest(),
        splitext(filename)[1]
    )


class BaseModel(Model):
    name = CharField(max_length=255)

    class Meta:
        abstract = True

    def __unicode__(self):
        return self.name


class PersistentModel(Model):
    class Meta:
        abstract = True

    persistent_id = CharField(max_length=16, unique=True)


class Album(BaseModel):
    class Meta:
        unique_together = ("artist", "name")

    artist = CharField(max_length=255)
    image = ImageField(upload_to=get_album_media_location)


class Song(BaseModel, PersistentModel):
    album = ForeignKey(Album, CASCADE, related_name="songs")
    artist = CharField(max_length=255)
    file = FileField(upload_to=get_song_media_location)


class Playlist(BaseModel, PersistentModel):
    songs = ManyToManyField(Song, blank=True)
