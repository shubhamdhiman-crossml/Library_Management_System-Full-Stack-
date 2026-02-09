import api from '@/lib/api';
import type { User, UserCreate } from '@/types';

export const usersService = {
  getAll: async () => {
    const res = await api.get('/users/')
    return res.data.results // ✅ RETURN ARRAY ONLY
  },

  // Get single user
  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}/`);
    return response.data;
  },

  // Create user
  create: async (data: UserCreate): Promise<User> => {
    const response = await api.post<User>('/users/', data);
    return response.data;
  },

  // Update user
  update: async (id: number, data: Partial<UserCreate>): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/`, data);
    return response.data;
  },

  // Delete user
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/`);
  },
};
