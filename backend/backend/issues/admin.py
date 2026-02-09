from django.contrib import admin
from .models import Issue

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'issue_date', 'due_date', 'returned')
    list_filter = ('returned', 'issue_date', 'due_date')
    search_fields = ('user__username', 'book__title')
