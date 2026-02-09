from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)   
    isbn = models.CharField(max_length=20, unique=True) 
    category = models.CharField(max_length=100)
    publisher = models.CharField(max_length=255)
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)

    def __str__(self):
        return self.title