# Generated by Django 3.2.7 on 2021-09-29 06:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0024_rename_fumbles_player_fumbles_fmb'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='fumbles_lost',
            new_name='fumbles_lost_FL',
        ),
    ]