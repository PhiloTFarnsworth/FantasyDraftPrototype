# Generated by Django 3.2.7 on 2021-11-18 23:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0053_alter_fantasyteam_manager'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='draftdetails',
            unique_together={('player', 'league')},
        ),
    ]
