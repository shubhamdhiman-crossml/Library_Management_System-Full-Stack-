'use client';

import { Book as BookType } from '@/types';
import { BookOpen, User, Tag, Building2 } from 'lucide-react';
import { cn, getAvailabilityStatus } from '@/lib/utils';

interface BookCardProps {
  book: BookType;
  onView?: (book: BookType) => void;
  onIssue?: (book: BookType) => void;
}

export default function BookCard({ book, onView, onIssue }: BookCardProps) {
  const isAvailable = book.available_copies > 0;

  return (
    <div className="card card-body hover:scale-105 transition-transform duration-200 animate-fade-in">
      <div className="flex flex-col h-full">
        {/* Book Icon/Thumbnail */}
        <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center">
          <BookOpen className="w-20 h-20 text-white opacity-80" />
        </div>

        {/* Book Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {book.title}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="truncate">{book.author}</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="truncate">{book.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{book.publisher}</span>
            </div>
          </div>

          {/* ISBN */}
          <p className="text-xs text-gray-500 mt-3">ISBN: {book.isbn}</p>
        </div>

        {/* Availability Status */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span
              className={cn(
                'badge',
                isAvailable ? 'badge-success' : 'badge-error'
              )}
            >
              {getAvailabilityStatus(book.available_copies, book.total_copies)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onView?.(book)}
              className="btn btn-outline flex-1 text-sm py-2"
            >
              View Details
            </button>
            {isAvailable && (
              <button
                onClick={() => onIssue?.(book)}
                className="btn btn-primary flex-1 text-sm py-2"
              >
                Issue Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
