# Generated by Django 3.2.7 on 2021-10-18 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0049_alter_draftdetails_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='league',
            name='completed',
            field=models.BooleanField(default=False),
        ),
    ]
