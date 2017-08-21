from __future__ import unicode_literals

import hashlib
from json import dumps
from os import environ, walk
from os.path import join, isfile, normpath

import boto3
from boto3.s3.transfer import TransferConfig
from botocore.exceptions import ClientError
from concurrent.futures import ThreadPoolExecutor

from scripts.console import Console


class EnvNames(object):
    """
    Pseudo enumerator containing the environment variable names used by this script.
    """
    aws_access_key_id = "AWS_ACCESS_KEY_ID"
    aws_default_region = "AWS_DEFAULT_REGION"
    aws_secret_access_key = "AWS_SECRET_ACCESS_KEY"
    local_directory = "LOCAL_DIRECTORY"
    s3_bucket_name = "S3_BUCKET_NAME"

# Settings.
AWS_ACCESS_KEY_ID = environ.get(EnvNames.aws_access_key_id)
AWS_DEFAULT_REGION = environ.get(EnvNames.aws_default_region, "us-east-1")
AWS_SECRET_ACCESS_KEY = environ.get(EnvNames.aws_secret_access_key)
LOCAL_DIRECTORY = unicode(environ.get(EnvNames.local_directory))
S3_BUCKET_NAME = environ.get(EnvNames.s3_bucket_name)


# AWS resources.
s3 = boto3.resource("s3")
s3_client = boto3.client("s3")
s3_transfer_config = TransferConfig()


def _pprint_dictionary(dictionary):
    """
    Pretty print a dictionary that represents JSON data.
    :param dictionary: A dictionary.
    """
    dictionary = "\n\t".join(dumps(dictionary, indent=4).splitlines())
    Console.put("\t{}".format(dictionary))


class S3Bucket(object):
    """
    Object representing an AWS S3 bucket.
    """

    def __init__(self, name):
        self.name = name
        self.bucket = s3.Bucket(self.name)
        try:
            # Check if the bucket exists.
            s3.meta.client.head_bucket(Bucket=self.name)
        except ClientError as error:
            error_code = int(error.response["Error"]["Code"])
            # Create the bucket if it does not exist.
            if error_code != 404:
                raise error
            else:
                self.create(name)

    @property
    def keys(self):
        """
        Get the list of keys in the S3 bucket.
        :return: Generator yielding keys in the S3 bucket.
        """
        for s3_key in self.bucket.objects.all():
            yield s3_key

    def create(self, name):
        """
        Create a new S3 bucket.
        :param name: Name of bucket.
        """
        Console.info("Creating {}".format(self.bucket))
        s3.create_bucket(Bucket=name)
        Console.success("Create Success: {}".format(self.bucket))

    def delete(self):
        """
        Delete S3 bucket.
        """
        Console.error("Deleting --- {}".format(self.bucket))
        for s3_key in self.keys:
            self.delete_key(s3_key)
        Console.success("Delete Response: {}".format(self.bucket))
        _pprint_dictionary(self.bucket.delete())
        self.bucket = None

    def put_file(self, s3_key, file_path):
        """
        Store a file in this S3 bucket.
        :param s3_key: Key the file will be uploaded to.
        :param file_path: File path to a local file.
        """
        key = s3_key.key
        Console.info("Uploading <-- {}".format(key))
        self.bucket.upload_file(file_path, key, Config=s3_transfer_config)
        Console.success("Upload Success: {}".format(key))

    def create_key(self, value):
        """
        Create a S3 key for this S3 bucket with the provided value.
        :param value: Key value.
        :return: S3 key.
        """
        return self.bucket.Object(value)

    def delete_key(self, s3_key):
        """
        Delete a S3 key from this S3 bucket.
        :param s3_key: S3 key.
        """
        if s3_key.bucket_name != self.name:
            raise ValueError("{} does not belong to {}.".format(s3_key, self.bucket))
        Console.error("Deleting --- Key {}".format(s3_key.key))
        Console.success("Delete Response: Key {}".format(s3_key.key))
        _pprint_dictionary(s3_key.delete())


def validate_setup():
    """
    Ensure all required settings are available. Raises a ValueError if there are missing settings.
    """
    errors = []
    if AWS_ACCESS_KEY_ID is None or AWS_SECRET_ACCESS_KEY is None:
        errors.append("Missing {} and / or {}. You must specify your AWS credentials.".format(
            EnvNames.aws_access_key_id,
            EnvNames.aws_secret_access_key
        ))
    if LOCAL_DIRECTORY is None:
        errors.append("Missing {}. You must specify a local directory to sync from.".format(EnvNames.local_directory))
    if S3_BUCKET_NAME is None:
        errors.append("Missing {}. You must specify a S3 bucket to sync to.".format(EnvNames.s3_bucket_name))
    if errors:
        raise ValueError("Missing environment variables.\n\t{}".format("\n\t".join(errors)))


def get_file_paths(directory):
    """
    Get a list of all file paths in a directory.
    :param directory: File path to a local base directory.
    :return: A list of all file paths in the base directory.
    """
    file_paths = []
    for parent, directory_names, file_names in walk(directory):
        for file_name in file_names:
            file_paths.append(normpath(join(parent, file_name)))
    return file_paths


def convert_file_path_to_key(file_path, s3_bucket):
    """
    Convert a local file path to a S3 key in the provided S3 bucket.
    :param file_path: File path to a local file.
    :param s3_bucket: S3 bucket.
    :return: A S3 key.
    """
    file_path = normpath(file_path.replace(LOCAL_DIRECTORY, "", 1))
    file_path = file_path.replace("\\", "/")  # S3 only treats "/" as directory separators.
    file_path = file_path[1:] if file_path.startswith("/") else file_path
    return s3_bucket.create_key(file_path)


def convert_s3_key_to_path(s3_key):
    """
    Convert a S3 key to a local file path.
    :param s3_key: S3 key.
    :return: File path to a local file.
    """
    return normpath(join(LOCAL_DIRECTORY, s3_key.key))


def calculate_e_tag(file_path):
    """
    Calculate the ETag of a file. An ETag is a hash-like value that S3 assigns to each file.
    :param file_path: File path to a local file.
    :return: An ETag value.
    """
    if not isfile(file_path):
        return None
    num_chunks = 0
    chunk_digests = b""
    with open(file_path, "rb") as file_stream:
        for chunk in iter(lambda: file_stream.read(s3_transfer_config.multipart_chunksize), b""):
            chunk_digests += hashlib.md5(chunk).digest()
            num_chunks += 1
    if num_chunks > 1:
        return "{}-{}".format(hashlib.md5(chunk_digests).hexdigest(), num_chunks)
    return chunk_digests.encode("hex")


def find_stale_files_in_s3_bucket(s3_bucket):
    """
    Find the files in an S3 bucket that are not up to date with their local counterpart.
    :param s3_bucket: S3 bucket.
    :return: A list of tuples containing the stale S3 key and its corresponding local file path.
    """
    stale_files = []
    for s3_key in s3_bucket.keys:
        file_path = convert_s3_key_to_path(s3_key)
        local_e_tag = calculate_e_tag(file_path)
        if local_e_tag is None:  # If there is no ETag, the file no longer exists on the local file system.
            stale_files.append((s3_key, None))
        elif local_e_tag != s3_key.e_tag[1:-1]:  # Ignore the quotes in the S3 key's ETag.
            stale_files.append((s3_key, file_path))
    return stale_files


def find_missing_files_in_s3_bucket(file_paths, s3_bucket):
    """
    Find the file paths paths that do not have a corresponding key in the S3 bucket.
    :param file_paths: A list of local file paths.
    :param s3_bucket: S3 bucket.
    :return: A list of tuples containing a S3 key and a local file path to the missing file.
    """
    known_file_paths = set(convert_s3_key_to_path(bucket_key) for bucket_key in s3_bucket.keys)
    file_paths = set(file_paths)
    missing_files = file_paths - known_file_paths
    return [(convert_file_path_to_key(file_path, s3_bucket), file_path) for file_path in missing_files]


def main():
    validate_setup()
    s3_bucket = S3Bucket(S3_BUCKET_NAME)
    file_paths = get_file_paths(LOCAL_DIRECTORY)

    diff_pairs = find_stale_files_in_s3_bucket(s3_bucket) + find_missing_files_in_s3_bucket(file_paths, s3_bucket)

    with ThreadPoolExecutor() as executor:
        for s3_key, file_path in diff_pairs:
            if file_path is not None:
                executor.submit(s3_bucket.put_file, s3_key, file_path)
            else:
                # If there is no corresponding local file, delete the S3 key from the S3 bucket.
                s3_bucket.delete_key(s3_key)
    Console.success("Sync complete!")


if __name__ == "__main__":
    main()
