# Generated by Django 3.2.7 on 2021-09-29 06:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0011_rename_pass_attempts_player_pass_attempts_att'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='passing_yards',
            new_name='passing_yards_YDS',
        ),
    ]
