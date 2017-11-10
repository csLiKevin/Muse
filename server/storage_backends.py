from storages.backends.s3boto3 import S3Boto3Storage


class StaticStorage(S3Boto3Storage):
    location = "static"


class MediaStorage(S3Boto3Storage):
    default_acl = "private"
    bucket_acl = default_acl
    location = "media"
