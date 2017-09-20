from __future__ import unicode_literals

from os.path import join, isfile
from plistlib import readPlist

from django.core.management import call_command
from django.core.management.base import BaseCommand

from music.models import Song, Playlist


IGNORED_PLAYLISTS = [
    "90\u2019s Music",
    "Audiobooks",
    "Classical Music",
    "Downloaded",
    "Library",
    # "Music",
    "Music Videos",
    "Movies",
    "My Top Rated",
    "Podcasts",
    "Purchased",
    # "Recently Added",
    "Recently Played",
    "Top 25 Most Played",
    "TV Shows"
]


class Command(BaseCommand):
    help = "Seed database from an iTunes library XML file."

    def add_arguments(self, parser):
        parser.add_argument("itunes_library", type=unicode)

    def handle(self, itunes_library, *args, **options):
        if not isfile(itunes_library):
            self.stderr.write("{} is not a file.".format(itunes_library))
        else:
            call_command("migrate")
            itunes_library = readPlist(itunes_library)
            music_folder = join(itunes_library["Music Folder"], "Music/")
            tracks = {}
            for track in itunes_library["Tracks"].itervalues():
                if track["Track Type"] == "File":
                    location = track["Location"].replace(music_folder, "")
                    name = track["Name"]
                    track_id = track["Track ID"]
                    tracks[track_id] = Song.objects.create(
                        file=location,
                        name=name
                    )
                    self.stdout.write(self.style.SUCCESS("Imported: {}".format(name)))
            for playlist in itunes_library["Playlists"]:
                name = playlist["Name"]
                if name in IGNORED_PLAYLISTS:
                    continue
                playlist_items = playlist.get("Playlist Items", [])
                playlist = Playlist.objects.create(name=name)
                for item in playlist_items:
                    track_id = item["Track ID"]
                    playlist.songs.add(tracks[track_id])
                self.stdout.write(self.style.SUCCESS("Playlist Created: {}".format(name)))
