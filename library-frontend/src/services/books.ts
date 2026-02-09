import api from '@/lib/api';
import type { Book, BookCreate, PaginatedResponse } from '@/types';

export const booksService = {
  getAll: async () => {
    const res = await api.get('/books/')
    return res.data.results // ✅ RETURN ARRAY ONLY
  },

  // Get single book
  getById: async (id: number): Promise<Book> => {
    const response = await api.get<Book>(`/books/${id}/`);
    return response.data;
  },

  // Create book
  create: async (data: BookCreate): Promise<Book> => {
    const response = await api.post<Book>('/books/', data);
    return response.data;
  },

  // Update book
  update: async (id: number, data: Partial<BookCreate>): Promise<Book> => {
    const response = await api.patch<Book>(`/books/${id}/`, data);
    return response.data;
  },

  // Delete book
  delete: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}/`);
  },

  // Search books
  search: async (query: string): Promise<Book[]> => {
    const response = await api.get<Book[]>('/books/', {
      params: { search: query },
    });
    return response.data;
  },
};
