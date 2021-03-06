# Muse

https://muse.kevinli.us · https://csLiKevin.github.io/Muse

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

## (Optional) Remote Storage

Host media and backup files on [remote storage](https://www.azuracast.com/extending/s3-configuration.html) instead of the server.

1. Configure [S3](https://s3.console.aws.amazon.com/s3) as a storage location.
    1. `Administration > Storage Location > Station Media > + Add Storage Location`
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
    3. `Administration > Storage Location > Backups > + Add Storage Location`
    4. Use the same configuration as `Station Media` except change `Path/Suffix` to `/backup`.
2. Configure a station to use remote storage.
    1. `Administration > Stations > Edit > Media Storage Location`
    2. Select newly added storage location.
3. Configure automatic backups.
    1. `Administration > Backups > Configure`
    2. Check `Run Automatic Nightly Backups`.
    3. Check `Exclude Media from Backups`.
    4. Set `Scheduled Backup Time`.
    5. Select newly added storage location.

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

### SSL Certificate is Outdated

After creating a new SSL certificate you may have to remove the old certificate for the new one to take effect.

```
cd /var/azuracast
docker-compose down
docker volume rm azuracast_letsencrypt
docker-compose up -d
```

### Running Out of Disk Space

Docker containers grow overtime as you add music. If you run out of disk space, Docker will encounter errors and cause your radio station to crash.

Also `docker` commands won't execute because the system cannot create files in the `/tmp` directory.

View filesystem `Use%` to confirm the problem.

```
df -hT
```

Free up space with the methods below. If the problem is recurring, expand your disk size.

#### Restart Containers With Detached Volumes

If logs are taking up too much space, restart containers with new volumes and remove old volumes.

```
docker-compose down
docker-compose up -d
docker volume prune
```

#### Delete Dangling Resources

Deletes resources not being used by a running container.

```
docker system prune -a --volumes
```

#### Removing a Container

Last resort to free up space.

Remove the container named `azuracast_web` and stop the remaining containers until you can expand the disk size.

```
docker container ls --format 'table {{.ID}}\t{{.Names}}\t{{.Size}}'
docker rm --force id_of_azuracast_web
docker-compose down
```

#### Expand Disk Size

Modify volume size and [extend the file system](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html#extend-file-system). Specific instructions differ based on operating system and file systems. Example instructions below.

1. View the details of your server. In the storage tab select the volume you want to expand.
2. `Actions > Modify Volume > Increase Size > Modify`
3. SSH into your server.
4. Check if the volume size has increased.
    ```
    lsblk
    ```
5. Extend partition.
    ```
    growpart /dev/xvdf 1
    ```
6. Extend file system.
    ```
    resize2fs /dev/xvda1
    ```
7. File system size should now be reflected.
    ```
    df -hT
    ```

## TODO

- Sync playlists.
