from django.urls import path
from .views import main , dese , get

urlpatterns = [
    path('', main),
    path('/dese' , dese),
    path('/get' , get)
]