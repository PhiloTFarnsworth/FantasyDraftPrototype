# Generated by Django 3.2.7 on 2021-09-29 06:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0023_rename_receiving_touchdowns_player_receiving_touchdowns_tds'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='fumbles',
            new_name='fumbles_FMB',
        ),
    ]