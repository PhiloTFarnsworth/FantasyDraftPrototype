# Generated by Django 3.2.7 on 2021-10-15 21:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0044_remove_league_draftedplayers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fantasyteam',
            name='roster',
        ),
    ]
