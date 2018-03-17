from os.path import isfile, join, abspath
from plistlib import load
from unicodedata import category
from urllib.parse import unquote

from django.core.management import BaseCommand
from os import walk


def normalize_file_path(file_path):
    return abspath(unquote(file_path).replace("file://localhost/", ""))


class Command(BaseCommand):
    help = "Check iTunes library XML file for compatibility."

    def add_arguments(self, parser):
        parser.add_argument("itunes_library", type=str)

    def handle(self, itunes_library, *args, **options):
        if not isfile(itunes_library):
            self.stderr.write("ERROR: {} is not a file.".format(itunes_library))
            return

        with open(itunes_library, "rb") as itunes_library_stream:
            itunes_library = load(itunes_library_stream)

        itunes_library_files = []
        tracks = itunes_library["Tracks"].values()
        self.stdout.write("INFO: {} files detected.".format(len(tracks)))

        for track in tracks:
            location = normalize_file_path(track["Location"])
            kind = track["Kind"]
            itunes_library_files.append(location)

            if kind not in ["MPEG audio file", "Purchased AAC audio file", "AAC audio file"]:
                self.stdout.write("WARNING: {} has an unsupported file format.".format(location))
                continue

            for index, char in enumerate(location):
                character_category = category(char)
                invalid_category_type = None

                if character_category == "Cc":
                    invalid_category_type = "Control"
                elif character_category == "Cf":
                    invalid_category_type = "Format"

                if invalid_category_type:
                    self.stdout.write("WARNING: {} has a {} character at position {}.".format(
                        location,
                        invalid_category_type,
                        index
                    ))

        music_folder = normalize_file_path(join(itunes_library["Music Folder"], "Music"))
        itunes_library_files = set(location.lower() for location in itunes_library_files)
        for directory, subdirectories, file_names in walk(music_folder):
            directory = normalize_file_path(directory)

            if not subdirectories and not file_names:
                self.stdout.write("WARNING: {} is an empty directory.".format(directory))

            for name in file_names:
                location = normalize_file_path(join(directory, name))

                try:
                    itunes_library_files.remove(location.lower())
                except KeyError:
                    self.stdout.write("WARNING: {} is not tracked by iTunes.".format(location))
