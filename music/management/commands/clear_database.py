from django.core.management.base import BaseCommand

from music.models import Song, Playlist


class Command(BaseCommand):
    help = "Delete all music objects from the database."

    def handle(self, *args, **options):
        Song.objects.all().delete()
        Playlist.objects.all().delete()
