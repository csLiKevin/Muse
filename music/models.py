from django.db.models import Model, FileField, CharField, ManyToManyField


class Song(Model):
    file = FileField()
    name = CharField(max_length=255)


class Playlist(Model):
    name = CharField(max_length=255)
    songs = ManyToManyField(Song)
