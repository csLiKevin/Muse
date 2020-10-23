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
    1. Install [Python 3.8.5](https://www.python.org/downloads/).
    2. Install [Node 8.12.0](https://nodejs.org/en/download/).
    3. Create and activate a Python virtual environment.
    4. Install Python dependencies.
        ```bash
        pip install -r requirements.txt
        ```
        On windows you may need to install [precompiled wheels](https://www.lfd.uci.edu/~gohlke/pythonlibs/) for some packages.
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
7. Update the CORS Configuration for the S3 bucket. Use the API Gateway url from step 6 as the `AllowedOrigin` value.
    ```xml
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>https://api.example.com</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
            <MaxAgeSeconds>3000</MaxAgeSeconds>
            <AllowedHeader>Authorization</AllowedHeader>
        </CORSRule>
    </CORSConfiguration>
    ```
8. Update the bucket policy for the S3 bucket. Include the API Gateway url from step 6 and bucket url in the referer list.
    ```json
    {
        "Version": "2012-10-17",
        "Id": "Http referer policy",
        "Statement": [
            {
                "Sid": "Allow get requests from specific referers.",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::your.bucket.name/*",
                "Condition": {
                    "StringLike": {
                        "aws:Referer": [
                            "https://api.example.com/*",
                            "https://s3.amazonaws.com/your.bucket.name/*"
                        ]
                    }
                }
            }
        ]
    }
    ```
9. Update the following `zappa` settings.
    ```json
    {
       "dev": {
         "aws_environment_variables": {
           "DJANGO_ALLOWED_HOSTS": "api.example.com",
           "DJANGO_AWS_STORAGE_BUCKET_NAME": "s3.example.com",
           "DJANGO_DATABASE_HOST": "rds.example.com",
           "DJANGO_DATABASE_NAME": "dbname",
           "DJANGO_DATABASE_PASSWORD": "dbpassword",
           "DJANGO_DATABASE_PORT": "5432",
           "DJANGO_DATABASE_USER": "admin",
           "DJANGO_SECRET_KEY": "topsecret",
           "STAGE": "public"
         }
       },
       "aws_region": "us-east-1",
       "vpc_config": {
         "SubnetIds": ["subnet-1", "subnet-2", "subnet-3"],
         "SecurityGroupIds": ["sg-1"]
       }
    }
    ```
10. Apply the updated settings.
    ```bash
    zappa update dev
    ```
11. Sync static files to the S3 bucket.
    ```bash
    zappa manage dev "collectstatic --noinput"
    ```
12. Initialize the database.
    ```bash
    zappa manage dev "migrate"
    ```
13. Create an admin super user.
    ```bash
    zappa invoke --raw dev "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'password')"
    ```

### Associate a custom domain
1. Register a domain name.
2. Create a hosted zone with Route 53. A nameserver (NS) and start of authority (SOA) record set will be automatically created for you.
3. Go to your domain registrar and add the list of values in your Route 53 nameserver record set as the Custom DNS nameservers for your domain.
4. Request a digital certificate from Amazon's Certificate Manager. Add the naked domain as the domain name.
5. Add the digital certificate's ARN and naked domain to your deploy settings file. Add the naked domain to the list of allowed hosts.
    ```json
    {
       "dev": {
         "aws_environment_variables": {
           "DJANGO_ALLOWED_HOSTS": "example.com,api.example.com"
         },
         "certificate_arn": "arn:aws:acm:us-east-1:123:certificate/123",
         "domain": "example.com"
       }
    }
    ```
6. Add the certificate and domain to the API Gateway.
    ```bash
    zappa certify dev
    ```
7. Update the S3 bucket's allowed origin to your domain.
    ```xml
    <AllowedOrigin>https://example.com</AllowedOrigin>
    ```
8. Update the S3 bucket's bucket policy to include your domain as an accepted HTTP referer.
    ```json
    {
        "aws:Referer": [
            "https://example.com/*",
            "https://s3.amazonaws.com/your.bucket.name/*"
        ]
    }
    ```

## Teardown deployment
Remove all AWS resources created by `zappa`.

```bash
zappa undeploy dev
```

## Django management commands

To run these commands locally for a remote instance of the application you have to set the same environment variables as your `zappa` settings file.
Also make sure that your RDS instance is publicly accessible and its security group allows inbound traffic from your IP address.

Some management commands rely on an iTunes library XML file. To export your iTunes library as a XML file enable the following setting in iTunes.
```
Edit
-> Preferences
-> Advanced
-> Share iTunes Library XML with other applications
```

### clear_database

Drop all model objects in the `music` app.

```bash
python manage.py clear_database
```
```bash
zappa manage dev clear_database
```

### evaluate_library

Check your iTunes library for compatibility.

```bash
python manage.py evaluate_library "path/to/iTunes/iTunes Music Library.xml"
```

### seed_database

Create database entries for each audio file, album, and playlist in your iTunes library.

```bash
python manage.py seed_database "path/to/iTunes/iTunes Music Library.xml"
```

## Packaging

Package this project as a desktop application.

Setup environment variables for remote and distribution builds.

```
API_URL="https://example.com/"
STATIC_URL="https://s3.amazonaws.com/example-bucket-name/"
```

### Local build

Start an application instance using local files.

```bash
python manage.py runserver
npm run watch-electron
npm run electron
```

### Remote build

Start an application instance that makes api requests and static file requests to remote endpoints.

```bash
npm run electron
```

### Distribution build

Package a standalone application for distribution. [Output Location](media/dist)

```bash
npm run package
```

## REST API

### GET /api/songs/

Retrieve a list songs.

#### Query Parameters

- album_artist
- album_name
- persistent_id
