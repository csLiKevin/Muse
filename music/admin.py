from django.contrib import admin

from music.models import Album, Playlist, Song

admin.site.register(Album)
admin.site.register(Playlist)
admin.site.register(Song)
