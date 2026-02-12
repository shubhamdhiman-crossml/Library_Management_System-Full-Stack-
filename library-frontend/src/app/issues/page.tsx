'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Calendar, User, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { issuesService } from '@/services/issues';
import { booksService } from '@/services/books';
import { usersService } from '@/services/users';
import { formatDate, isOverdue, getDaysUntilDue } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Issue, Book, User as UserType } from '@/types';
import { useStore } from '@/store';

export default function IssuesPage() {
  const queryClient = useQueryClient();
  const { searchQuery, currentUser } = useStore();
  const [enrichedIssues, setEnrichedIssues] = useState<
    (Issue & { user_details?: UserType; book_details?: Book })[]
  >([]);
  const isAdmin =
    currentUser?.is_staff ||
    currentUser?.is_superuser ||
    currentUser?.role === 'staff';

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: () => issuesService.getAll(),
  });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: () => booksService.getAll(),
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const returnBookMutation = useMutation({
    mutationFn: (id: number) => issuesService.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Book returned successfully!');
    },
    onError: () => {
      toast.error('Failed to return book');
    },
  });

  useEffect(() => {
    if (issues && books && users) {
      const enriched = issues.map((issue) => ({
        ...issue,
        book_details: books.find((b) => b.id === issue.book),
        user_details: users.find((u) => u.id === issue.user),
      }));
      setEnrichedIssues(enriched);
    }
  }, [issues, books, users]);

  const handleReturn = (id: number) => {
    if (!isAdmin) {
      toast.error('Only admins can mark books as returned');
      return;
    }
    if (confirm('Are you sure you want to mark this book as returned?')) {
      returnBookMutation.mutate(id);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchedIssues = normalizedQuery
    ? enrichedIssues.filter((issue) => {
        const haystack = [
          issue.book_details?.title ?? '',
          issue.book_details?.author ?? '',
          issue.book_details?.isbn ?? '',
          String(issue.book),
          issue.user_details?.first_name ?? '',
          issue.user_details?.last_name ?? '',
          issue.user_details?.username ?? '',
          issue.user_details?.email ?? '',
          String(issue.user),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : enrichedIssues;

  const activeIssues = searchedIssues.filter((issue) => !issue.returned);
  const returnedIssues = searchedIssues.filter((issue) => issue.returned);
  const overdueIssues = activeIssues.filter((issue) =>
    isOverdue(issue.due_date)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Issues</h1>
        <p className="text-gray-600 mt-2">Track issued and returned books</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrichedIssues.length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeIssues.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {overdueIssues.length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-gray-900">
                {returnedIssues.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Active Issues Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Issues</h2>
          <p className="text-sm text-gray-600 mt-1">
            Books currently issued to users
          </p>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>User</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeIssues.map((issue) => {
                  const overdue = isOverdue(issue.due_date);
                  const daysLeft = getDaysUntilDue(issue.due_date);

                  return (
                    <tr key={issue.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {issue.book_details?.title || `Book #${issue.book}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {issue.book_details?.author || 'Unknown Author'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>
                            {issue.user_details
                              ? `${issue.user_details.first_name} ${issue.user_details.last_name}`
                              : `User #${issue.user}`}
                          </span>
                        </div>
                      </td>
                      <td>{formatDate(issue.issue_date)}</td>
                      <td>{formatDate(issue.due_date)}</td>
                      <td>
                        <span
                          className={`badge ${
                            overdue ? 'badge-error' : 'badge-success'
                          }`}
                        >
                          {overdue
                            ? `Overdue by ${Math.abs(daysLeft)} days`
                            : `${daysLeft} days left`}
                        </span>
                      </td>
                      <td>
                        {isAdmin ? (
                          <button
                            onClick={() => handleReturn(issue.id)}
                            className="btn btn-success text-sm py-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Returned
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Admin only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {activeIssues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No active issues found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Returned Issues Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Returned Books History
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Previously issued books that have been returned
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>User</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returnedIssues.slice(0, 10).map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {issue.book_details?.title || `Book #${issue.book}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {issue.book_details?.author || 'Unknown Author'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        {issue.user_details
                          ? `${issue.user_details.first_name} ${issue.user_details.last_name}`
                          : `User #${issue.user}`}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(issue.issue_date)}</td>
                  <td>{formatDate(issue.due_date)}</td>
                  <td>
                    <span className="badge badge-success">
                      <CheckCircle className="w-3 h-3" />
                      Returned
                    </span>
                  </td>
                </tr>
              ))}
              {returnedIssues.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No returned issues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
