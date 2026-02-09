import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isAfter, differenceInDays } from 'date-fns';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

// Check if date is overdue
export function isOverdue(dueDate: string): boolean {
  return isAfter(new Date(), parseISO(dueDate));
}

// Get days until due
export function getDaysUntilDue(dueDate: string): number {
  return differenceInDays(parseISO(dueDate), new Date());
}

// Format user role
export function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get status color
export function getStatusColor(status: 'available' | 'issued' | 'overdue'): string {
  const colors = {
    available: 'text-green-600 bg-green-50',
    issued: 'text-blue-600 bg-blue-50',
    overdue: 'text-red-600 bg-red-50',
  };
  return colors[status] || colors.available;
}

// Get availability status
export function getAvailabilityStatus(available: number, total: number): string {
  if (available === 0) return 'Out of Stock';
  if (available === total) return 'Available';
  return `${available} of ${total} Available`;
}
