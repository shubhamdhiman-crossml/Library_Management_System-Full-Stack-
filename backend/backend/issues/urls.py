from django.urls import path
from .views import IssueListCreateView, IssueDetailView


urlpatterns = [
    path('', IssueListCreateView.as_view()),
    path('<int:pk>/', IssueDetailView.as_view()),
]