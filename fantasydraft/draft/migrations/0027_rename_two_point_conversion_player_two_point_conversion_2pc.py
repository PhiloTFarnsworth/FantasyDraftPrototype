# Generated by Django 3.2.7 on 2021-09-29 06:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0026_rename_all_touchdowns_player_all_touchdowns_tds'),
    ]

    operations = [
        migrations.RenameField(
            model_name='player',
            old_name='two_point_conversion',
            new_name='two_point_conversion_2PC',
        ),
    ]
