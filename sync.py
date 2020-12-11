from argparse import ArgumentParser, FileType
from boto3 import resource
from hashlib import md5
from mimetypes import guess_type
from os import walk
from os.path import abspath, join
from plistlib import load
from sys import stderr, stdout
from unicodedata import category
from urllib.parse import unquote


BUCKET_PREFIX = "music"


def normalize_path(path):
    return abspath(unquote(path).replace("file://localhost/", ""))


def get_md5(path):
    md5_hash = md5()
    with open(path, "rb") as stream:
        while chunk := stream.read(128 * md5_hash.block_size):
            md5_hash.update(chunk)
    return md5_hash.hexdigest()


parser = ArgumentParser("Sync iTunes library to S3")
parser.add_argument("-b", "--bucket", help="S3 Bucket", required=True, type=str)
parser.add_argument("-d", "--dry", action="store_true", help="skip changes to S3")
parser.add_argument(
    "-ilx",
    "--itunes_library_xml",
    help='path to "iTunes Music Library.xml"',
    required=True,
    type=FileType("rb"),
)
parser.add_argument("-k", "--key", help="AWS Access Key", required=True, type=str)
parser.add_argument(
    "-s", "--secret", help="AWS Secret Access Key", required=True, type=str
)

args = parser.parse_args()

itunes_library = load(args.itunes_library_xml)
tracks = itunes_library["Tracks"].values()
print(f"INFO: {len(tracks)} tracks detected.", file=stdout)

music_folder = normalize_path(join(itunes_library["Music Folder"], "Music"))
music_folder_paths = set()
for directory, subdirectories, file_names in walk(music_folder):
    directory = normalize_path(directory)

    if not subdirectories and not file_names:
        print(f"WARN: {directory} is an empty directory.", file=stderr)

    for name in file_names:
        music_folder_paths.add(join(directory, name).lower())

s3 = resource(
    "s3",
    aws_access_key_id=args.key,
    aws_secret_access_key=args.secret,
)
bucket = s3.Bucket(args.bucket)

s3_objects = {}
for s3_object in bucket.objects.filter(Prefix=BUCKET_PREFIX):
    key = s3_object.key

    # Ignore folders generated by Azuracast.
    if ".albumart" in key or ".waveforms" in key:
        continue

    s3_objects[key] = s3_object.e_tag.removeprefix('"').removesuffix('"')

# Upload modified or new files.
for track in tracks:
    location = normalize_path(track["Location"])
    kind = track["Kind"]

    # Keep track of files not tracked by iTunes.
    music_folder_paths.remove(location.lower())

    # Check for invalid file formats.
    if kind not in ["MPEG audio file", "Purchased AAC audio file", "AAC audio file"]:
        print(f"WARN: {location} has an unsupported file format.", file=stderr)

    # Check for invalid characters.
    for index, char in enumerate(location):
        character_category = category(char)
        invalid_category_type = None

        if character_category == "Cc":
            invalid_category_type = "Control"
        elif character_category == "Cf":
            invalid_category_type = "Format"

        if invalid_category_type:
            print(
                f"WARN: {location} has a {invalid_category_type} character at position {index}.",
                file=stderr,
            )

    # Build S3 key. Note: S3's directory separator must be /.
    key = f"{BUCKET_PREFIX}{location.removeprefix(music_folder)}".replace("\\", "/")

    e_tag = s3_objects.get(key)
    if e_tag is not None:
        # Keep track of files S3 has that don't exist locally.
        del s3_objects[key]

        # Files not uploaded using multipart and not encrypted have md5 e_tag values.
        if e_tag == get_md5(location):
            continue

    s3_object = s3.Object(args.bucket, key)
    with open(location, "rb") as stream:
        print(f"INFO: Uploading to S3 - {key}", file=stdout)

        if args.dry:
            continue

        content_type, _ = guess_type(key)
        s3_object.put(Body=stream, ContentType=content_type)

# Delete files not found locally.
for key in s3_objects.keys():
    print(f"INFO: Deleting from S3 - {key}", file=stdout)

    if args.dry:
        continue

    s3.Object(args.bucket, key).delete()

# Check for files not tracked by iTunes.
for path in music_folder_paths:
    print(f"WARN: {path} is not tracked by iTunes.", file=stderr)
