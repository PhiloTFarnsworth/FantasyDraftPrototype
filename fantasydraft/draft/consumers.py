import json
from channels.generic.websocket import WebsocketConsumer
from .models import FantasyTeam, Player, League
from django.core import serializers
from asgiref.sync import async_to_sync


class DraftConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['league']
        self.room_group_name = 'league_' + str(self.room_name)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    ## So this consumer is going to receive the pk of a player that has been selected,
    ## add the player to the relevant Fantasy Team and league, then send an updated list
    ## of drafted players for our draft script to parse.
    def receive(self, text_data):
        data_json = json.loads(text_data)
        print(data_json)
        league = League.objects.get(pk=data_json['league'])
        if data_json['type'] == 'start':
            league.locked = True
            league.save()
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'start',
                'data': 'start'
            })
            return
        team = FantasyTeam.objects.filter(league=league).get(name=' '.join(data_json['team'].split('_')))
        if data_json['type'] == 'draft':
            player = Player.objects.get(pk=data_json['player'])
            if (player in league.draftedPlayers.all()):
                self.send({'type': 'error', 'data': 'Player Already Selected.  Choose a different player, if problem persists, refresh and rejoin draft.'})
                return
            league.draftedPlayers.add(player)
            league.save()
            team.players.add(player)
            team.save()
            drafted = serializers.serialize('json', league.draftedPlayers.all())
            ## 12 == # of rounds
            if len(league.draftedPlayers.all()) >= len(FantasyTeam.objects.filter(league=league).all()) * 12:
                league.completed = True
                league.save()
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'draft',
                'data': drafted
            }
        )
        if data_json['type'] == 'status':
            print(team.active)
            if team.active == False:
                team.active = True
            else:
                team.active = False
            team.save()
            print(team.active)
            status = {}
            for team in FantasyTeam.objects.filter(league=league).all():
                if (team.manager != None):
                    status[team.name] = {'active': team.active, 'manager': team.manager.username}
                else:
                    status[team.name] = {'active': team.active, 'manager': 'No owner'}
            async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'status',
                'data': status
            }
        )
        
    def draft(self, event): 
        self.send(json.dumps({'type': event['type'], 'data': event['data'] }))

    def status(self, event):
        self.send(json.dumps({'type': event['type'], 'data': event['data']}))

    def start(self, event):
        self.send(json.dumps({'type': event['type']}))