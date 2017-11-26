from __future__ import unicode_literals

from io import BytesIO
from os.path import isfile
from plistlib import readPlist
from urlparse import unquote

from PIL import Image
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.core.management import call_command
from django.core.management.base import BaseCommand
from mutagen.id3 import ID3, ID3NoHeaderError
from mutagen.mp4 import MP4

from music.models import Song, Playlist, Album

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

                    album = track["Album"]
                    album_artist = track["Album Artist"]
                    artist = track["Artist"]
                    name = track["Name"]
                    persistent_id = track["Persistent ID"]
                    track_id = track["Track ID"]

                    album, album_created = Album.objects.get_or_create(artist=album_artist, name=album)
                    song, song_created = Song.objects.get_or_create(
                        album=album,
                        artist=artist,
                        name=name,
                        persistent_id=persistent_id
                    )
                    tracks[track_id] = song

                    if album_created or song_created:
                        with open(location, "rb") as file_stream:
                            if album_created:
                                with NamedTemporaryFile() as temp:
                                    try:
                                        image_data = ID3(fileobj=file_stream).getall("APIC")[0].data
                                    except ID3NoHeaderError:
                                        image_data = MP4(fileobj=file_stream).tags["covr"][0]
                                    image = Image.open(BytesIO(image_data))
                                    image.save(temp, image.format)
                                    album.image = File(temp, name="artwork.{}".format(image.format))
                                    album.save()
                                    self.stdout.write(self.style.SUCCESS("Album Created: {}".format(album)))

                            if song_created:
                                song.file = File(file_stream)
                                song.save()
                                self.stdout.write(self.style.SUCCESS("Song Imported: {}".format(name)))

            for playlist in itunes_library["Playlists"]:
                name = playlist["Name"]
                if name in IGNORED_PLAYLISTS:
                    continue
                persistent_id = playlist["Playlist Persistent ID"]
                playlist_items = playlist.get("Playlist Items", [])
                playlist, playlist_created = Playlist.objects.get_or_create(name=name, persistent_id=persistent_id)
                playlist.songs.set([tracks[item["Track ID"]] for item in playlist_items])
                if playlist_created:
                    self.stdout.write(self.style.SUCCESS("Playlist Created: {}".format(name)))
                else:
                    self.stdout.write(self.style.SUCCESS("Playlist Updated: {}".format(name)))
