# Generated by Django 3.2.7 on 2021-09-29 06:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0009_rename_games_started_player_games_started_gs'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='completions',
            new_name='completions_CMP',
        ),
    ]
