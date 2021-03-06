# Generated by Django 3.2.7 on 2021-09-29 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('draft', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='League',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
            ],
        ),
        migrations.AlterField(
            model_name='player',
            name='age',
            field=models.IntegerField(default=0, verbose_name='Age'),
        ),
        migrations.AlterField(
            model_name='player',
            name='allTouchdowns',
            field=models.IntegerField(default=0, verbose_name='TDS-All Touchdowns'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fantasyDK',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=5, verbose_name='DK-Draft Kings Fantasy Points'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fantasyFD',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=5, verbose_name='FD-Fan Duel Fantasy Points'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fantasyPPR',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=5, verbose_name='PPR-Fantasy Points Per Reception'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fantasyPoints',
            field=models.IntegerField(default=0, verbose_name='FP-Fantasy Points'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fantasyVBD',
            field=models.IntegerField(default=0, verbose_name='VBD-Value Over Baseline'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fumbles',
            field=models.IntegerField(default=0, verbose_name='FMB-Fumbles'),
        ),
        migrations.AlterField(
            model_name='player',
            name='fumblesLost',
            field=models.IntegerField(default=0, verbose_name='FL-Fumbles Lost'),
        ),
        migrations.AlterField(
            model_name='player',
            name='gamesPlayed',
            field=models.IntegerField(default=0, verbose_name='G-Games Played'),
        ),
        migrations.AlterField(
            model_name='player',
            name='gamesStarted',
            field=models.IntegerField(default=0, verbose_name='GS-Games Started'),
        ),
        migrations.AlterField(
            model_name='player',
            name='name',
            field=models.CharField(max_length=128, verbose_name='Name'),
        ),
        migrations.AlterField(
            model_name='player',
            name='passAttempts',
            field=models.IntegerField(default=0, verbose_name='ATT-Pass Attempts'),
        ),
        migrations.AlterField(
            model_name='player',
            name='passCompletions',
            field=models.IntegerField(default=0, verbose_name='CMP-Completions'),
        ),
        migrations.AlterField(
            model_name='player',
            name='passInterceptions',
            field=models.IntegerField(default=0, verbose_name='INT-Interceptions'),
        ),
        migrations.AlterField(
            model_name='player',
            name='passTouchdowns',
            field=models.IntegerField(default=0, verbose_name='TDS-Passing Touchdowns'),
        ),
        migrations.AlterField(
            model_name='player',
            name='passYards',
            field=models.IntegerField(default=0, verbose_name='YDS-Passing Yards'),
        ),
        migrations.AlterField(
            model_name='player',
            name='position',
            field=models.CharField(choices=[('QB', 'Quarterback'), ('RB', 'Runningback'), ('WR', 'Wide Receiver'), ('TE', 'Tight End')], default='WR', max_length=2, verbose_name='POS-Position'),
        ),
        migrations.AlterField(
            model_name='player',
            name='recReceptions',
            field=models.IntegerField(default=0, verbose_name='REC-Receptions'),
        ),
        migrations.AlterField(
            model_name='player',
            name='recTargets',
            field=models.IntegerField(default=0, verbose_name='TGT-Targets'),
        ),
        migrations.AlterField(
            model_name='player',
            name='recTouchdowns',
            field=models.IntegerField(default=0, verbose_name='TDS-Recieving Touchdowns'),
        ),
        migrations.AlterField(
            model_name='player',
            name='recYards',
            field=models.IntegerField(default=0, verbose_name='YDS-Receiving Yards'),
        ),
        migrations.AlterField(
            model_name='player',
            name='recYardsCatch',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3, verbose_name='Y/R-Receiving Yards Per Catch'),
        ),
        migrations.AlterField(
            model_name='player',
            name='rushAttempts',
            field=models.IntegerField(default=0, verbose_name='ATT-Rushing Attempts'),
        ),
        migrations.AlterField(
            model_name='player',
            name='rushTouchdowns',
            field=models.IntegerField(default=0, verbose_name='TDS-Rushing Touchdowns'),
        ),
        migrations.AlterField(
            model_name='player',
            name='rushYards',
            field=models.IntegerField(default=0, verbose_name='YDS-Rushing Yards'),
        ),
        migrations.AlterField(
            model_name='player',
            name='rushYardsAttempt',
            field=models.DecimalField(decimal_places=1, default=0, max_digits=3, verbose_name='Y/A-Rushing Yards Per Attempt'),
        ),
        migrations.AlterField(
            model_name='player',
            name='team',
            field=models.CharField(choices=[('ARI', 'Arizona Cardinals'), ('ATL', 'Atlanta Falcons'), ('BAL', 'Baltimore Ravens'), ('BUF', 'Buffalo Bills'), ('CAR', 'Carolina Panthers'), ('CHI', 'Chicago Bears'), ('CIN', 'Cincinnati Bengals'), ('CLE', 'Cleveland Browns'), ('DAL', 'Dallas Cowboys'), ('DEN', 'Denver Broncos'), ('DET', 'Detroit Lions'), ('GNB', 'Green Bay Packers'), ('HOU', 'Houston Texans'), ('IND', 'Indianapolis Colts'), ('JAX', 'Jacksonville Jaguars'), ('KAN', 'Kansas City Chiefs'), ('LAC', 'Los Angeles Chargers'), ('LAR', 'Los Angeles Rams'), ('LVR', 'Las Vegas Raiders'), ('MIA', 'Miami Dolphins'), ('MIN', 'Minnesota Vikings'), ('NOR', 'New Orleans Saints'), ('NWE', 'New England Patriots'), ('NYG', 'New York Giants'), ('NYJ', 'New York Jets'), ('PHI', 'Philadelphia Eagles'), ('PIT', 'Pittsburgh Steelers'), ('SEA', 'Seattle Seahawks'), ('SFO', 'San Francisco 49ers'), ('TAM', 'Tampa Bay Buccaneers'), ('TEN', 'Tennesse Titans'), ('WAS', 'Washington Football Team'), ('2TM', 'Multiple Teams'), ('FA', 'Free Agent')], default='FA', max_length=3, verbose_name='Team'),
        ),
        migrations.AlterField(
            model_name='player',
            name='twoPointConversion',
            field=models.IntegerField(default=0, verbose_name='2PC-Two Point Conversion'),
        ),
        migrations.AlterField(
            model_name='player',
            name='twoPointConversionPass',
            field=models.IntegerField(default=0, verbose_name='2PP-Two Point Converison Pass'),
        ),
    ]
