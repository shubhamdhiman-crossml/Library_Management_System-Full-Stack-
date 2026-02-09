import api from '@/lib/api';
import type { Issue, IssueCreate } from '@/types';

export const issuesService = {
  getAll: async () => {
    const res = await api.get('/issues/')
    return res.data.results // ✅ RETURN ARRAY ONLY
  },



  // Get single issue
  getById: async (id: number): Promise<Issue> => {
    const response = await api.get<Issue>(`/issues/${id}/`);
    return response.data;
  },

  // Create issue (issue a book)
  create: async (data: IssueCreate): Promise<Issue> => {
    const response = await api.post<Issue>('/issues/', data);
    return response.data;
  },

  // Update issue (return a book)
  update: async (id: number, data: Partial<Issue>): Promise<Issue> => {
    const response = await api.patch<Issue>(`/issues/${id}/`, data);
    return response.data;
  },

  // Return book
  returnBook: async (id: number): Promise<Issue> => {
    const response = await api.patch<Issue>(`/issues/${id}/`, {
      returned: true,
    });
    return response.data;
  },

  // Delete issue
  delete: async (id: number): Promise<void> => {
    await api.delete(`/issues/${id}/`);
  },
};
