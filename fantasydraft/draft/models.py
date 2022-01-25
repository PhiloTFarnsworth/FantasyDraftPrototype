from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Player(models.Model):
    TEAMS = (
        ('ARI', 'Arizona Cardinals'),
        ('ATL', 'Atlanta Falcons'),
        ('BAL', 'Baltimore Ravens'),
        ('BUF', 'Buffalo Bills'),
        ('CAR', 'Carolina Panthers'),
        ('CHI', 'Chicago Bears'),
        ('CIN', 'Cincinnati Bengals'),
        ('CLE', 'Cleveland Browns'),
        ('DAL', 'Dallas Cowboys'),
        ('DEN', 'Denver Broncos'),
        ('DET', 'Detroit Lions'),
        ('GNB', 'Green Bay Packers'),
        ('HOU', 'Houston Texans'),
        ('IND', 'Indianapolis Colts'),
        ('JAX', 'Jacksonville Jaguars'),
        ('KAN', 'Kansas City Chiefs'),
        ('LAC', 'Los Angeles Chargers'),
        ('LAR', 'Los Angeles Rams'),
        ('LVR', 'Las Vegas Raiders'),
        ('MIA', 'Miami Dolphins'),
        ('MIN', 'Minnesota Vikings'),
        ('NOR', 'New Orleans Saints'),
        ('NWE', 'New England Patriots'),
        ('NYG', 'New York Giants'),
        ('NYJ', 'New York Jets'),
        ('PHI', 'Philadelphia Eagles'),
        ('PIT', 'Pittsburgh Steelers'),
        ('SEA', 'Seattle Seahawks'),
        ('SFO', 'San Francisco 49ers'),
        ('TAM', 'Tampa Bay Buccaneers'),
        ('TEN', 'Tennesse Titans'),
        ('WAS', 'Washington Football Team'),
        ('MUL', 'Multiple Teams'),
        ('FA', 'Free Agent')
    )
    POSITIONS = (
        ('QB', 'Quarterback'),
        ('RB', 'Runningback'),
        ('WR', 'Wide Receiver'),
        ('TE', 'Tight End')
    )
    ## this should contain all the info from nfl_2020.csv
    name = models.CharField('Name', max_length=128)
    ## name code will allow us to make use of football reference's trove of information
    name_code_FB = models.CharField(max_length=128)
    team = models.CharField('Team', max_length=3, choices=TEAMS, default='FA')
    ## There's a fair number of players listed who didn't record points, or recorded
    ## points but are considered defensive players.  For this project, we're just going
    ## to consider them wide receivers.
    position_POS = models.CharField('POS-Position', max_length=2, choices=POSITIONS, default='WR')
    age = models.IntegerField('Age', default=0)
    ## Names get awfully rough because we can't seem to access verbose names in the serialization
    games_played_G = models.IntegerField('G', default=0)
    games_started_GS = models.IntegerField('GS', default=0)
    completions_CMP = models.IntegerField('CMP', default=0)
    pass_attempts_ATT = models.IntegerField('ATT', default=0)
    passing_yards_YDS = models.IntegerField('YDS', default=0)
    passing_touchdowns_TDS = models.IntegerField('TDS', default=0)
    interceptions_INT = models.IntegerField('INT', default=0)
    rush_attempts_ATT = models.IntegerField('ATT', default=0)
    rushing_yards_YDS = models.IntegerField('YDS', default=0)
    rushing_yards_per_attempt_YPA = models.DecimalField('Y/A', default=0, decimal_places=1, max_digits=3)
    rushing_touchdowns_TDS = models.IntegerField('TDS', default=0)
    targets_TGT = models.IntegerField('TGT', default=0)
    receptions_REC = models.IntegerField('REC', default=0)
    receiving_yards_YDS = models.IntegerField('YDS', default=0)
    receiving_yards_per_catch_YPC = models.DecimalField('Y/R', default=0, decimal_places=1, max_digits=3)
    receiving_touchdowns_TDS = models.IntegerField('TDS', default=0)
    fumbles_FMB = models.IntegerField('FMB', default=0)
    fumbles_lost_FL = models.IntegerField('FL', default=0)
    ## I'm assuming they add miscellaneous touchdowns to touchdowns of every 
    ## type 
    all_touchdowns_TDS = models.IntegerField('TDS', default=0)
    two_point_conversion_2PC = models.IntegerField('2PC', default=0)
    two_point_conversion_pass_2PP = models.IntegerField('2PP', default=0)
    fantasy_points_FP = models.IntegerField('FP', default=0)
    fantasy_PPR_PPR = models.DecimalField('PPR', default=0, decimal_places=1, max_digits=5)
    fantasy_DK_DK = models.DecimalField('DK', default=0, decimal_places=1, max_digits=5)
    fantasy_FD_FD = models.DecimalField('FD', default=0, decimal_places=1, max_digits=5)
    fantasy_VBD_VBD = models.IntegerField('VBD', default=0)

    
    def __str__(self):
        return self.name

class League(models.Model):
    name = models.CharField(max_length=128)
    ## This feels a little messy, but we'll track drafted players here through draftdetails.
    draftedPlayers = models.ManyToManyField(Player, through='DraftDetails', through_fields=('league', 'player'))
    locked = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class FantasyTeam(models.Model):
    name = models.CharField(max_length=128)
    players = models.ManyToManyField(Player)
    manager = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    league = models.ForeignKey(League, on_delete=models.CASCADE, null=True)
    commissioner = models.BooleanField(default=False)
    ## active for the moment will just track whether the team is in the draft instance.
    ## I don't think it belongs in the model but my other ideas to deal with this are worse. 
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = [['name', 'league'], ['manager', 'league']]

## Sadly, it doesn't appear like there's an easy way to access Django's implicit through table to access
## the id of the relationship, which would give us the order that players were selected.  So DraftDetails
## will just hold the creation of the relationship, and we'll return the drafted players in order of creation.
class DraftDetails(models.Model):
    drafted = models.DateTimeField(auto_now=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    league = models.ForeignKey(League, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = (['drafted'])
        unique_together = ['player', 'league']

class Roster(models.Model):
    ## Not going to finish this part, but this would be a through model for players belonging to a team
    ## where users would sort their roster of players into starters and benched players.
    pass