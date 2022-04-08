from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def main(request):
    return HttpResponse("hello")

def dese(reques):
    return HttpResponse("Dese is the ultimate King")
def get(request):
    return HttpResponse("get")
