# Generated by Django 3.2.7 on 2021-10-04 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0034_alter_player_team'),
    ]

    operations = [
        migrations.AddField(
            model_name='league',
            name='draftedPlayers',
            field=models.ManyToManyField(to='draft.Player'),
        ),
    ]
