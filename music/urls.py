from django.urls import path

from music.views import SongList

urlpatterns = [
    path('songs/', SongList.as_view()),
]
