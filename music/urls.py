from django.urls import path

from music.views import Album, Song, SongList

urlpatterns = [
    path('albums/<str:artist>/<str:name>/', Album.as_view()),
    path('songs/<slug:persistent_id>/', Song.as_view()),
    path('songs/', SongList.as_view()),
]
