# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-26 02:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import music.models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0001_initial'),
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
        migrations.AddField(
            model_name='song',
            name='artist',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='album',
            unique_together=set([('artist', 'name')]),
        ),
        migrations.AddField(
            model_name='song',
            name='album',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='music.Album'),
            preserve_default=False,
        ),
    ]
