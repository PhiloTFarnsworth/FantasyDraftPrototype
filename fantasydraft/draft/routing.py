from django.urls import path

from . import consumers


websocket_urlpatterns = [
    path('ws/draft/<int:league>/', consumers.DraftConsumer.as_asgi()),
]