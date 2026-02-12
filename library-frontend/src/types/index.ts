// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'staff' | 'external';
  phone: string;
  is_active: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  date_joined: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'staff' | 'external';
  phone?: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: 'student' | 'staff' | 'external';
  phone?: string;
  is_active?: boolean;
}

// Book Types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  total_copies: number;
  available_copies: number;
}

export interface BookCreate {
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  total_copies: number;
  available_copies: number;
}

// Issue Types
export interface Issue {
  id: number;
  user: number;
  book: number;
  issue_date: string;
  due_date: string;
  returned: boolean;
  user_details?: User;
  book_details?: Book;
}

export interface IssueCreate {
  user: number;
  book: number;
  due_date?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Filter and Search Types
export interface BookFilters {
  search?: string;
  category?: string;
  author?: string;
}

export interface IssueFilters {
  returned?: boolean;
  user?: number;
  book?: number;
}

// Dashboard Stats
export interface DashboardStats {
  total_books: number;
  total_users: number;
  total_issues: number;
  active_issues: number;
  overdue_issues: number;
  available_books: number;
}
