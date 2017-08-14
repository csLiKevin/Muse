# Muse

## Sync local directory to S3

Preserve directory structure and upload files to S3.
Files in S3 that differ from the local copy are reuploaded.
Files in S3 that do not exist in the local directory are deleted from S3.

1. Setup environment variables.
    ```bash
    PYTHONPATH="."
    PYTHONUNBUFFERED=1

    LOCAL_DIRECTORY=""         # Local directory to sync from.
    S3_BUCKET_NAME=""          # S3 bucket to sync to.
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    ```
2. Run `python scripts/sync_to_s3.py`.
