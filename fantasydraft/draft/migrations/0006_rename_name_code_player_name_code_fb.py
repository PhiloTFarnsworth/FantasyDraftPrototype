# Generated by Django 3.2.7 on 2021-09-29 06:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0005_rename_rushing_attempts_player_rush_attempts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='name_code',
            new_name='name_code_FB',
        ),
    ]
