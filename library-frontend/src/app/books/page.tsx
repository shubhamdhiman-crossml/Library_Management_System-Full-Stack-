'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import BookCard from '@/components/BookCard';
import Modal from '@/components/Modal';
import { booksService } from '@/services/books';
import { issuesService } from '@/services/issues';
import { usersService } from '@/services/users';
import type { Book, BookCreate, IssueCreate, User } from '@/types';
import { useForm } from 'react-hook-form';
import { useStore } from '@/store';

export default function BooksPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { searchQuery } = useStore();

  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: () => booksService.getAll(),
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const addBookMutation = useMutation({
    mutationFn: (data: BookCreate) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book added successfully!');
      setIsAddModalOpen(false);
    },
    onError: () => {
      toast.error('Failed to add book');
    },
  });

  const issueBookMutation = useMutation({
    mutationFn: (data: IssueCreate) => issuesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book issued successfully!');
      setIsIssueModalOpen(false);
      setSelectedBook(null);
    },
    onError: () => {
      toast.error('Failed to issue book');
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookCreate> }) =>
      booksService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book updated successfully!');
      setIsViewModalOpen(false);
      setSelectedBook(null);
      resetEditBook();
    },
    onError: () => {
      toast.error('Failed to update book');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => booksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book deleted successfully!');
      setIsViewModalOpen(false);
      setSelectedBook(null);
      resetEditBook();
    },
    onError: () => {
      toast.error('Failed to delete book');
    },
  });

  const {
    register: registerBook,
    handleSubmit: handleSubmitBook,
    reset: resetBook,
  } = useForm<BookCreate>();

  const {
    register: registerEditBook,
    handleSubmit: handleSubmitEditBook,
    reset: resetEditBook,
  } = useForm<BookCreate>();

  const {
    register: registerIssue,
    handleSubmit: handleSubmitIssue,
    reset: resetIssue,
  } = useForm<{ user: number }>();

  const onAddBook = (data: BookCreate) => {
    addBookMutation.mutate(data);
    resetBook();
  };

  const onIssueBook = (data: { user: number }) => {
    if (selectedBook) {
      const dueDate = new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString();
      issueBookMutation.mutate({
        user: data.user,
        book: selectedBook.id,
        due_date: dueDate,
      });
      resetIssue();
    }
  };

  const handleIssueClick = (book: Book) => {
    setSelectedBook(book);
    setIsIssueModalOpen(true);
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsViewModalOpen(true);
    resetEditBook({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publisher: book.publisher,
      total_copies: book.total_copies,
      available_copies: book.available_copies,
    });
  };

  const onUpdateBook = (data: BookCreate) => {
    if (!selectedBook) return;
    updateBookMutation.mutate({ id: selectedBook.id, data });
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    if (confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(selectedBook.id);
    }
  };

  const categories = Array.from(
    new Set(books?.map((book) => book.category) || [])
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredBooks =
    selectedCategory === 'all'
      ? books
      : books?.filter((book) => book.category === selectedCategory);

  const searchedBooks = normalizedQuery
    ? filteredBooks?.filter((book) => {
        const haystack = [
          book.title,
          book.author,
          book.isbn,
          book.category,
          book.publisher,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : filteredBooks;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Books</h1>
          <p className="text-gray-600 mt-2">Manage your library collection</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="card card-body">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`btn text-sm ${
              selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            All Books ({books?.length || 0})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn text-sm ${
                selectedCategory === category ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {category} (
              {books?.filter((b) => b.category === category).length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchedBooks?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onView={handleViewDetails}
              onIssue={handleIssueClick}
            />
          ))}
        </div>
      )}

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Book"
        size="lg"
      >
        <form onSubmit={handleSubmitBook(onAddBook)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...registerBook('title', { required: true })}
                className="input"
                placeholder="Enter book title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                {...registerBook('author', { required: true })}
                className="input"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                {...registerBook('isbn', { required: true })}
                className="input"
                placeholder="Enter ISBN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                {...registerBook('category', { required: true })}
                className="input"
                placeholder="e.g., Fiction, Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                {...registerBook('publisher', { required: true })}
                className="input"
                placeholder="Enter publisher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                {...registerBook('total_copies', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="Enter total copies"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Copies *
              </label>
              <input
                type="number"
                {...registerBook('available_copies', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="Enter available copies"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </div>
        </form>
      </Modal>

      {/* View / Edit Book Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedBook(null);
        }}
        title="Book Details"
        size="lg"
      >
        <form
          onSubmit={handleSubmitEditBook(onUpdateBook)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...registerEditBook('title', { required: true })}
                className="input"
                placeholder="Enter book title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                {...registerEditBook('author', { required: true })}
                className="input"
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                {...registerEditBook('isbn', { required: true })}
                className="input"
                placeholder="Enter ISBN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                {...registerEditBook('category', { required: true })}
                className="input"
                placeholder="e.g., Fiction, Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher *
              </label>
              <input
                {...registerEditBook('publisher', { required: true })}
                className="input"
                placeholder="Enter publisher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Copies *
              </label>
              <input
                type="number"
                {...registerEditBook('total_copies', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Copies *
              </label>
              <input
                type="number"
                {...registerEditBook('available_copies', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="input"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={handleDeleteBook}
              className="btn btn-secondary text-red-600 hover:bg-red-50"
            >
              Delete Book
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedBook(null);
                }}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Update Book
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedBook(null);
        }}
        title="Issue Book"
      >
        <form onSubmit={handleSubmitIssue(onIssueBook)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book
            </label>
            <input
              value={selectedBook?.title || ''}
              disabled
              className="input bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User *
            </label>
            <select
              {...registerIssue('user', {
                required: true,
                valueAsNumber: true,
              })}
              className="input"
            >
              <option value="">Choose a user...</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsIssueModalOpen(false);
                setSelectedBook(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Book
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
