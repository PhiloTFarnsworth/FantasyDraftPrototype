# Generated by Django 3.2.7 on 2021-09-29 06:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0007_rename_position_player_position_pos'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='games_played',
            new_name='games_played_G',
        ),
    ]
