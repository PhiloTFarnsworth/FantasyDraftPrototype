# Generated by Django 3.2.7 on 2021-09-29 06:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0016_rename_rushing_yards_player_rushing_yards_yds'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='rushing_yards_per_attempt',
            new_name='rushing_yards_per_attempt_YPA',
        ),
    ]
