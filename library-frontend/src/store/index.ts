import { create } from 'zustand';
import type { User, Book, Issue } from '@/types';

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Books state
  books: Book[];
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  updateBook: (id: number, book: Partial<Book>) => void;
  removeBook: (id: number) => void;
  
  // Issues state
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: number, issue: Partial<Issue>) => void;
  removeIssue: (id: number) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // User state
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Books state
  books: [],
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, updatedBook) =>
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id ? { ...book, ...updatedBook } : book
      ),
    })),
  removeBook: (id) =>
    set((state) => ({ books: state.books.filter((book) => book.id !== id) })),
  
  // Issues state
  issues: [],
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (id, updatedIssue) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, ...updatedIssue } : issue
      ),
    })),
  removeIssue: (id) =>
    set((state) => ({ issues: state.issues.filter((issue) => issue.id !== id) })),
  
  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
