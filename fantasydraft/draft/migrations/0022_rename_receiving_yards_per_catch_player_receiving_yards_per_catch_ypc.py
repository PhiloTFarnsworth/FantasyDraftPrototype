# Generated by Django 3.2.7 on 2021-09-29 06:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0021_rename_receiving_yards_player_receiving_yards_yds'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='receiving_yards_per_catch',
            new_name='receiving_yards_per_catch_YPC',
        ),
    ]
