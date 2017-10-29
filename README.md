# Muse

Application for hosting your iTunes library online.

**Note for Windows users:**
Prepend `python` and `zappa` commands with `winpty` if you need an interactive text terminal.

```
winpty zappa undeploy dev
```

## Setup

1. Setup environment variables.
    ```
    PYTHONPATH="."
    PYTHONUNBUFFERED=1
    
    # Replace with your credentials.
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    ```
2. Install dependencies.
    1. Install [Python 2.7](https://www.python.org/downloads/).
    2. Install [Node 6.9](https://nodejs.org/en/download/).
    3. Create and activate a Python virtual environment.
    4. Install Python dependencies.
        ```bash
        pip install -r requirements.txt
        ```
3. Build web client.
    ```bash
    cd client/source
    npm install
    npm run build
    cd -
    ```

## Start local server

```bash
python manage.py migrate
python manage.py runserver
```

## Deploy

Make application public.

1. Create or select an existing Amazon Virtual Private Cloud (VPC).
2. Create a VPC endpoint for Amazon's S3 service.
3. Create a S3 bucket.
4. Create a RDS instance.
    ```
    PostgreSQL
    Only enable options eligible for RDS Free Usage Tier
    Public accessibility
    ```
5. Create deploy settings file. Provide the name of the S3 bucket created in step 3 when prompted.
    ```bash
    zappa init
    ```
6. Deploy with `zappa`. After this is completed an API Gateway url is returned.
    ```bash
    zappa deploy dev
    ```
7. Update the CORS Configuration for the S3 bucket. Use the API Gateway url from step 6 to replace the `AllowedOrigin` value.
    ```xml
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <MaxAgeSeconds>3000</MaxAgeSeconds>
            <AllowedHeader>Authorization</AllowedHeader>
        </CORSRule>
    </CORSConfiguration>
    ```
8. Update the following `zappa` settings.
    ```json
    {
       "dev": {
         "aws_environment_variables": {
           "DJANGO_AWS_STORAGE_BUCKET_NAME": "",
           "DJANGO_ALLOWED_HOSTS": "",
           "DJANGO_DATABASE_HOST": "",
           "DJANGO_DATABASE_NAME": "",
           "DJANGO_DATABASE_PASSWORD": "",
           "DJANGO_DATABASE_PORT": "",
           "DJANGO_DATABASE_USER": "",
           "DJANGO_SECRET_KEY": "",
           "STAGE": "public"
         }
       },
       "vpc_config": {
         "SubnetIds": [],
         "SecurityGroupIds": []
       }
    }
    ```
9. Apply the updated settings.
    ```bash
    zappa update dev
    ```
10. Sync static files to the S3 bucket.
    ```bash
    zappa manage dev "collectstatic --noinput"
    ```
11. Initialize the database.
    ```bash
    zappa manage dev "migrate"
    ```
12. Create an admin super user.
    ```bash
    zappa invoke --raw dev "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'password')"
    ```

## Teardown deployment
Remove all AWS resources created by `zappa`.

```bash
zappa undeploy dev
```

## Django management commands

To run these commands locally for a remote instance of the application you have to set the same environment variables as your `zappa` settings file.
Also make sure that your RDS instance is publicly accessible and its security group allows inbound traffic from your IP address.

### clear_database

Drop all model objects in the `music` app.

```bash
python manage.py clear_database
```
```bash
zappa manage dev clear_database
```

### seed_database

Create database entries for each audio file and playlist in your iTunes library.

Export your iTunes library as a XML file.
```
Edit
-> Preferences
-> Advanced
-> Share iTunes Library XML with other applications
```

```bash
python manage.py seed_database "path/to/iTunes/iTunes Music Library.xml"
```
