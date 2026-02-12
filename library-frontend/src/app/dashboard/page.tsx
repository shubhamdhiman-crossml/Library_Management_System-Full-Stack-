'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Users,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import { booksService } from '@/services/books';
import { usersService } from '@/services/users';
import { issuesService } from '@/services/issues';
import { formatDate, isOverdue, getDaysUntilDue } from '@/lib/utils';
import type { Book, Issue, User } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeIssues: 0,
    overdueIssues: 0,
  });

  const { data: books } = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: () => booksService.getAll(),
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getAll(),
  });

  const { data: issues } = useQuery<Issue[]>({
    queryKey: ['issues'],
    queryFn: () => issuesService.getAll(),
  });

  useEffect(() => {
    if (books && users && issues) {
      const activeIssues = issues.filter((issue) => !issue.returned);
      const overdueIssues = activeIssues.filter((issue) =>
        isOverdue(issue.due_date)
      );

      setStats({
        totalBooks: books.length,
        totalUsers: users.length,
        activeIssues: activeIssues.length,
        overdueIssues: overdueIssues.length,
      });
    }
  }, [books, users, issues]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-white-600 mt-2">
          Welcome back! Here's an overview of your library.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Issues"
          value={stats.activeIssues}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueIssues}
          icon={AlertCircle}
          color="red"
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Issues */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {issues?.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Book ID: {issue.book}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    User ID: {issue.user} • {formatDate(issue.issue_date)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`badge text-xs ${
                        issue.returned
                          ? 'badge-success'
                          : isOverdue(issue.due_date)
                          ? 'badge-error'
                          : 'badge-info'
                      }`}
                    >
                      {issue.returned
                        ? 'Returned'
                        : isOverdue(issue.due_date)
                        ? 'Overdue'
                        : `${getDaysUntilDue(issue.due_date)} days left`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Books */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Popular Books</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {books?.slice(0, 5).map((book) => (
              <div
                key={book.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {book.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="badge badge-success text-xs">
                      {book.available_copies} available
                    </span>
                    <span className="text-xs text-gray-500">
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card card-body">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/books" className="btn btn-primary p-6 flex-col h-auto">
            <BookOpen className="w-8 h-8 mb-2" />
            <span>Add New Book</span>
          </Link>
          <Link href="/users" className="btn btn-outline p-6 flex-col h-auto">
            <Users className="w-8 h-8 mb-2" />
            <span>Register User</span>
          </Link>
          <Link href="/books" className="btn btn-outline p-6 flex-col h-auto">
            <FileText className="w-8 h-8 mb-2" />
            <span>Issue Book</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
