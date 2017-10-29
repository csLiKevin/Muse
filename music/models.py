from os.path import splitext

from django.db.models import Model, FileField, CharField, ManyToManyField


def get_song_media_location(instance, filename):
    return "song/{}{}".format(instance.persistent_id, splitext(filename)[1])


class BaseModel(Model):
    name = CharField(max_length=255)
    persistent_id = CharField(max_length=16, unique=True)

    class Meta:
        abstract = True


class Song(BaseModel):
    file = FileField(upload_to=get_song_media_location)


class Playlist(BaseModel):
    songs = ManyToManyField(Song, blank=True)
