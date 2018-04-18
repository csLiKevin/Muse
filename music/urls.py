from django.urls import path

from music.views import AlbumList, SongList

urlpatterns = [
    path('albums/', AlbumList.as_view()),
    path('songs/', SongList.as_view()),
]
