# Muse

Application for hosting your iTunes library online.

## Setup

1. Install [Python 2.7](https://www.python.org/downloads/).
2. Setup environment variables.
    ```
    PYTHONPATH="."
    PYTHONUNBUFFERED=1
    ```

### Sync local directory to S3

Preserve directory structure and upload files to S3.
Files in S3 that differ from the local copy are reuploaded.
Files in S3 that do not exist in the local directory are deleted from S3.

1. Setup environment variables.
    ```
    LOCAL_DIRECTORY=""         # Local directory to sync from.
    S3_BUCKET_NAME=""          # S3 bucket to sync to.
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    ```
2. Run command.
    ```bash
    python scripts/sync_to_s3.py
    ```

### Seed local database

Create database entries for each audio file and playlist in your iTunes library.

1. Enable the option to share your iTunes library with other applications in your iTunes application.
    ```
    Edit
    -> Preferences
    -> Advanced
    -> Share iTunes Library XML with other applications
    ```
2. Run command.
    ```bash
    python manage.py seed_database "path/to/iTunes/iTunes Music Library.xml"
    ```

### Build web client

1. Install [Node 6.9](https://nodejs.org/en/download/)
2. Change current directory to `Muse/client/static/client/js`
3. Install dependencies.
    ```bash
    npm install
    ```
4. Build Javascript bundle.
    ```bash
    npm build
    ```

## Management

### Delete the database

```bash
python manage.py clear_database
```

### Delete the S3 bucket

## Development

### Start local server

```bash
python manage.py runserver
```
