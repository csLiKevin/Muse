# Generated by Django 2.0.3 on 2018-03-11 22:58

from django.db import migrations, models
import django.db.models.deletion
import music.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('artist', models.CharField(max_length=255)),
                ('image', models.ImageField(upload_to=music.models.get_album_media_location)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('persistent_id', models.CharField(max_length=16, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('persistent_id', models.CharField(max_length=16, unique=True)),
                ('artist', models.CharField(max_length=255)),
                ('file', models.FileField(upload_to=music.models.get_song_media_location)),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='music.Album')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='playlist',
            name='songs',
            field=models.ManyToManyField(blank=True, to='music.Song'),
        ),
        migrations.AlterUniqueTogether(
            name='album',
            unique_together={('artist', 'name')},
        ),
    ]
