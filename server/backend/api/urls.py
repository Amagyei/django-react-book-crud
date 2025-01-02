from django.urls import path 
from .views import get_books,add_book, book_detail

urlpatterns = [
    path('books', get_books, name = 'get_books'),
    path('books/create/', add_book, name='add_book'),
    path('books/<int:pk>', book_detail, name='book_detail')
]
