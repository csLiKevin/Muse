# Muse

Self host your iTunes library as a web radio station.

## Installation

1. Launch a web server ([EC2](https://console.aws.amazon.com/ec2)).
    1. Select `Ubuntu Server 20.04 LTS 64-bit (x86)` as the AMI.
    2. Select an instance type with at least 2 GB of memory, such as `t2`.
    3. Add a security group with the following rules:
        - Inbound Rules
            |Type |Protocol|Port Range|Source   |
            |:-:  |:-:     |:-:       |:-:      |
            |SSH  |TCP     |22        |YOUR IP  |
            |HTTP |TCP     |80        |0.0.0.0/0|
            |HTTPS|TCP     |443       |0.0.0.0/0|
            This will allow anyone to access the server with their browser. It also allows SSH access from your IP address.
        - Outbound Rules
            |Type |Protocol|Port Range|Source   |
            |:-:  |:-:     |:-:       |:-:      |
            |HTTP |TCP     |80        |0.0.0.0/0|
            |HTTPS|TCP     |443       |0.0.0.0/0|
            This allows the server to make web requests during the installation process.
    4. (Optional) Tag all newly created resources so you can identify which resources to delete for teardown.
    5. When you launch your server it will ask you to assign a key pair to the server. Make sure you have access to the `pem` file.
2. Install [Azuracast](https://www.azuracast.com/install/docker.html).
    1. View the details of your server and grab the `Public IPv4 DNS` value.
    2. SSH into your server.
        ```
        ssh -i path/to/my.pem ubuntu@my-instance-public-dns-name
        ```
    3. Run the following commands:
        ```
        sudo su
        mkdir -p /var/azuracast
        cd /var/azuracast
        curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/master/docker.sh > docker.sh
        chmod a+x docker.sh
        yes 'Y' | ./docker.sh setup-release
        yes '' | ./docker.sh install
        ```
        **Note:** Super user access is required because resources need to be created outside of the home folder.
3. Configure Azuracast.
    1. Paste the `Public IPv4 DNS` in a browser to visit your Azuracast installation.
    2. It will ask you set the login credentials of the administrator.
    3. Create a station. `Name` is the only required field.
    4. (Optional) Configure system settings.

## (Optional) Remote storage

Host media files on [remote storage](https://www.azuracast.com/extending/s3-configuration.html) instead of the server.

1. Configure [S3](https://s3.console.aws.amazon.com/s3) as a storage location.
    1. `Administration > Storage Location > + Add Storage Location`
    2. Configuration:
        |             |                          |
        |---          |---                       |
        |Path/Suffix  |/music                    |
        |Storage Quota|                          |
        |Access Key ID|YOUR_AWS_ACCESS_KEY_ID    |
        |Secret Key   |YOUR_AWS_ACCESS_KEY_SECRET|
        |Endpoint     |https://s3.amazonaws.com  |
        |Bucket Name  |YOUR_BUCKET_NAME          |
        |Region       |YOUR_BUCKET_REGION        |
        |API Version  |latest                    |
2. Configure a station to use remote storage.
    1. `Administration > Stations > Edit > Media Storage Location`
    2. Select newly added storage location.

### Sync Music

1. Create a virtual environment.
    ```
    python -m venv virtualenv
    ```
2. Activate the virtual environment.
    ```
    source ./virtualenv/Scripts/activate
    ```
3. Install dependencies.
    ```
    pip install -r requirements.txt
    ```
4. Export iTunes Library as an XML file.
    1. Open iTunes.
    2. `Edit > Preferences > Advanced`
    3. Check `Share iTunes Library XML with other applications`.
5. Run sync script:
    ```
    python sync.py \
        -b AWS_S3_BUCKET_NAME \
        -k AWS_ACCESS_KEY_ID \
        -s AWS_SECRET_ACCESS_KEY \
        -ilx="path/to/your/iTunes Music Library.xml"
    ```

## (Optional) Enable HTTPS
1. Add a custom domain to [Route 53](https://console.aws.amazon.com/route53).
2. Run `./docker.sh letsencrypt-create`.
3. In your browser navigate to your custom domain with https.
3. `Administration > System Settings`
    - Settings Tab
        - Change `Site Base URL` from http to https.
        - Check `Use Web Proxy for Radio`.
    - Security Tab
        - Check `Always Use HTTPS`.

## Maintenance

Use commands in the [Docker utility script](https://www.azuracast.com/developers/docker-sh.html).

### Update Azuracast
```
sudo su
cd /var/azuracast
./docker.sh update-self
yes "" | ./docker.sh update
```

## Development

Format files
```
black .
```

## Troubleshooting

Remove a SSL certificate.
```
cd /var/azuracast
docker-compose down
docker volume rm azuracast_letsencrypt
docker-compose up -d
```

## TODO

- Sync playlists.
