import csv
import json
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.http.response import HttpResponseRedirect
from django.core import serializers
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.urls import reverse
from django.db import IntegrityError
from .models import Player, FantasyTeam, League
from django.views.decorators.csrf import ensure_csrf_cookie


# Create your views here.
@ensure_csrf_cookie
def index(request):
    username = request.user.username
    return render(request, 'draft/index.html', {'username': username})

## Refresh the page based on login/logout.
def login_view(request):
    request_values = json.load(request)
    username = request_values['username']
    password = request_values['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'ok': True})
    else:
        ## Just pass a message to display on top of the login window.
        return JsonResponse({'error': 'Invalid Credentials.', 'ok': False})

def logout_view(request):
    logout(request)
    messages.success(request, 'Successfully Logged Out')
    return HttpResponseRedirect(reverse('index'))

def register(request):
    request_values = json.load(request)
    username = request_values['username']
    password = request_values['password']
    email = request_values['email']
    if password != request_values['confirm']:
        return JsonResponse({'error': 'Passwords do not match', 'ok': False})
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
        login(request, user)
    except IntegrityError:
        return JsonResponse({
            'error': 'Username Taken.',
            'ok': False
            }) 
    return JsonResponse({'username': username})

def get_drafts(request):
    if request.user.is_authenticated == False:
        return JsonResponse({'activeDrafts': {}, 'completedDrafts': {}}, safe=False)
    username = request.user.username
    activeDrafts = []
    completedDrafts = []
    manager = User.objects.get(username=username)
    teams = FantasyTeam.objects.filter(manager=manager).all()
    for team in teams:
        if team.league.completed == False:
            activeDrafts.append({'league': team.league.pk, 'leagueName': team.league.name, 'team': team.pk, 'teamName': team.name})
        else:
            completedDrafts.append({'league': team.league.pk, 'leagueName': team.league.name, 'team': team.pk, 'teamName': team.name})
    return JsonResponse({'activeDrafts': activeDrafts, 'completedDrafts': completedDrafts}, safe=False)

def DraftClass(request):
    players = serializers.serialize('json', Player.objects.all().order_by('-fantasy_VBD_VBD'))
    return JsonResponse(json.loads(players), safe=False)

def InitializeDraft(request):
    ## to start a draft we need to build a league and create teams within it.  For this demo, we'll just do our quick draft,
    ## so I figure it's fine if we just define teams and create a league in which to house them.
    teamNames = [
        'Tears of a Brown', 
        'Circle the Wagons', 
        'Motor City Kitties', 
        'Monday Morning Quarterbacks',
        'Mile High Club',
        'Relocated Raiders',
        'Pottsville Maroons',
        'Montreal Expos',
        'Country Roads, Take Mahomes',
        'The 12th Man',
        'Gang Green',
        'Tom Brady Spice',
        'Good Glavin',
        "America's Team"
        ]
    teamSet = set(teamNames)
    mainManager = User.objects.get(username=request.user.username)
    request_values = json.load(request)
    ##create league and teams.
    newLeague = League.objects.create(name=request_values['league'])
    teamList = []
    managers = []
    for i in range(int(request_values['teams'])):
        if i == int(request_values['position']) - 1:
            newTeam = FantasyTeam.objects.create(
                name=request_values['name'],
                manager=mainManager,
                league=newLeague, 
                commissioner=True
            )
            commissioner = newTeam.name
        else:
            newTeam = FantasyTeam.objects.create(
                name=teamSet.pop(),
                league=newLeague
            )
        teamList.append(newTeam.name)
        if (newTeam.manager != None): 
            managers.append(newTeam.manager.username)
        else:
            managers.append('No Owner')
    ## With the league and teams created, we need to send back a response that helps build the draft room.
    ## We need to send our teams and league to the front end, as well as a prepare a 'draftSocket', which we will
    ## use to update the draft as players are selected.
    return JsonResponse({'leagueID': newLeague.pk, 'teams': teamList, 'commissioner': commissioner, 'managers': managers})    

## When a draft is fully initiated, we lock draft to disallow other owners from joining.
def lockDraft(request):
    request_values = json.load(request)
    league = League.objects.get(pk=request_values['leagueID'])
    league.locked = True
    try:
        league.save()
    except:
        messages.error(request, "league lock failure")
        return HttpResponseRedirect(reverse('index'))
    return(JsonResponse({'message': 'Success'}))

def joinDraft(request, league_id, team_name):
    manager = request.user
    username = manager.username
    league = League.objects.get(pk=league_id)
    if league.locked == True:
        messages.error(request, 'Draft has already begun!')
        return HttpResponseRedirect(reverse('index'))
    team = FantasyTeam.objects.filter(league=league).get(name=' '.join(team_name.split('_')))
    if team.manager != None:
        messages.error(request, 'Team already has Manager!')
        return HttpResponseRedirect(reverse('index'))
    team.manager = manager
    ## need try excepts for every save operation.
    try:
        team.save()
    except:
        ## redirect to index, pass along error message
        messages.error(request, 'Already own team in league!')
        return HttpResponseRedirect(reverse('index'))
    teams = []
    managers = []
    for fTeam in FantasyTeam.objects.filter(league=league).all():
        teams.append(fTeam.name)
        if fTeam.manager != None:
            managers.append(fTeam.manager.username)
        else:
            managers.append('No owner')
    return render(request, 'draft/index.html', {'teams': teams, 'username':username, 'managers':managers})

def rejoin_draft(request):
    request_values = json.load(request)
    league_id = request_values['league_id']
    team_id = request_values['team_id']
    chosen_team = FantasyTeam.objects.get(pk=team_id)
    if request.user != chosen_team.manager:
        messages.error(request, 'Team/Manager paradox')
        return HttpResponseRedirect(reverse('index'))
    ## To further guard against the state of the an active, in client team, we set the value to false on click (Since they have to be out of a draft to access rejoin draft),
    ## then we set the chosen_team.active to false so that it can be correctly toggled when the draft component loads.  A little hacky, but I haven't mitigated websocket failures
    ## failing to toggle a team to inactive
    chosen_team.active = False
    try:
        chosen_team.save()
    except:
        messages.error(request, 'Database Error')
        return HttpResponseRedirect(reverse('index'))
    team_name = chosen_team.name
    league = League.objects.get(pk=league_id)
    draft_history = serializers.serialize('json', league.draftedPlayers.all())
    teams = []
    managers = []
    for team in FantasyTeam.objects.filter(league=league).all():
        teams.append(team.name)
        if (team.manager != None):
            managers.append(team.manager.username)
        else:
            managers.append('No owner')
        if team.commissioner == True:
            commissioner = team.name
    return JsonResponse({'leagueID': league_id, 
        'history': draft_history, 
        'teams': teams, 
        'teamControl': team_name, 
        'managers': managers, 
        'commissioner': commissioner, 
        'locked': league.locked
        })

## For importing players.  A more extendible method with the ability to update scores and available players is a bit
## beyond the scope atm, so I'll leave the original method here just for elaboration on how I curated the player dataset.
def importDraftClass(request):
    with open('nfl_2020.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            ## While many of the rows are straightforward, we do need to split player names with
            ## their football reference codes.
            names = row['Player'].split('\\')
            ## get rid of all-pro/pro bowl indicators.
            names[0] = names[0].rstrip('*+ ')
            for _, value in row.items():
                if value == '':
                    value = 0
            ## With names sorted, we can add the players.  Fear the tangled web of ...if ...else.
            Player.objects.create(
                name = names[0],
                name_code = names[1],
                ##team needs a conversion for 2TM/3TM/4TM -> MUL.  
                team = row['Tm'] if row['Tm'] != '' else 'FA',
                position = row['FantPos'] if row['FantPos'] != '' else 'WR',
                age = row['Age'] if row['Age'] != '' else 0,
                games_played = row['G']if row['G'] != '' else 0,
                games_started = row['GS']if row['GS'] != '' else 0,
                completions = row['pCmp']if row['pCmp'] != '' else 0,
                pass_attempts = row['pAtt'] if row['pAtt'] != '' else 0,
                passing_yards = row['pYds'] if row['pYds'] != '' else 0,
                passing_touchdowns = row['pTD'] if row['pTD'] != '' else 0,
                interceptions = row['pInt'] if row['pInt'] != '' else 0,
                rush_attempts = row['rAtt'] if row['rAtt'] != '' else 0,
                rushing_yards = row['rYds'] if row['rYds'] != '' else 0,
                rushing_yards_per_attempt = row['rY/A'] if row['rY/A'] != '' else 0,
                rushing_touchdowns = row['rTD'] if row['rTD'] != '' else 0,
                targets = row['cTgt'] if row['cTgt'] != '' else 0,
                receptions = row['cRec'] if row['cRec'] != '' else 0,
                receiving_yards = row['cYds'] if row['cYds'] != '' else 0,
                receiving_yards_per_catch = row['cY/R'] if row['cY/R'] != '' else 0,
                receiving_touchdowns = row['cTD'] if row['cTD'] != '' else 0,
                fumbles = row['Fmb'] if row['Fmb'] != '' else 0,
                fumbles_lost = row['FL'] if row['FL'] != '' else 0,
                all_touchdowns = row['aTD'] if row['aTD'] != '' else 0,
                two_point_conversion = row['2PM'] if row['2PM'] != '' else 0,
                two_point_conversion_pass = row['2PP'] if row['2PP'] != '' else 0,
                fantasy_points = row['FantPt'] if row['FantPt'] != '' else 0,
                fantasy_PPR = row['PPR'] if row['PPR'] != '' else 0,
                fantasy_DK = row['DKPt'] if row['DKPt'] != '' else 0,
                fantasy_FD = row['FDPt'] if row['FDPt'] != '' else 0,
                fantasy_VBD = row['VBD'] if row['VBD'] != '' else 0
            )
    return HttpResponse('Success')
