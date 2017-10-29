from __future__ import unicode_literals

from os.path import isfile
from plistlib import readPlist
from urlparse import unquote

from django.core.files import File
from django.core.management import call_command
from django.core.management.base import BaseCommand

from music.models import Song, Playlist

IGNORED_PLAYLISTS = [
    "90\u2019s Music",
    "Audiobooks",
    "Classical Music",
    "Downloaded",
    "Library",
    "Music",
    "Music Videos",
    "Movies",
    "My Top Rated",
    "Podcasts",
    "Purchased",
    "Recently Added",
    "Recently Played",
    "Top 25 Most Played",
    "TV Shows"
]


class Command(BaseCommand):
    help = "Seed database with an iTunes library XML file."

    def add_arguments(self, parser):
        parser.add_argument("itunes_library", type=unicode)

    def handle(self, itunes_library, *args, **options):
        if not isfile(itunes_library):
            self.stderr.write("{} is not a file.".format(itunes_library))
        else:
            call_command("migrate")
            itunes_library = readPlist(itunes_library)
            tracks = {}
            for track in itunes_library["Tracks"].itervalues():
                if track["Kind"] in ["MPEG audio file", "Purchased AAC audio file", "AAC audio file"]:
                    location = unquote(track["Location"]).decode("utf8").replace("file://localhost/", "")
                    name = track["Name"]
                    persistent_id = track["Persistent ID"]
                    track_id = track["Track ID"]
                    tracks[track_id], created = Song.objects.get_or_create(name=name, persistent_id=persistent_id)
                    if created:
                        with open(location, "rb") as file_stream:
                            tracks[track_id].file = File(file_stream)
                            tracks[track_id].save()
                        self.stdout.write(self.style.SUCCESS("Song Imported: {}".format(name)))
                    else:
                        self.stdout.write(self.style.SUCCESS("Song Skipped: {}".format(name)))
            for playlist in itunes_library["Playlists"]:
                name = playlist["Name"]
                if name in IGNORED_PLAYLISTS:
                    continue
                persistent_id = playlist["Playlist Persistent ID"]
                playlist_items = playlist.get("Playlist Items", [])
                playlist, created = Playlist.objects.get_or_create(name=name, persistent_id=persistent_id)
                playlist.songs.set([tracks[item["Track ID"]] for item in playlist_items])
                if created:
                    self.stdout.write(self.style.SUCCESS("Playlist Created: {}".format(name)))
                else:
                    self.stdout.write(self.style.SUCCESS("Playlist Updated: {}".format(name)))
