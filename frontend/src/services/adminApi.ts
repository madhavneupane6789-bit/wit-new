import api from './apiClient';
import { User } from './authApi';

export async function listUsers() {
  const res = await api.get<{ users: User[] }>('/api/admin/users');
  return res.data.users;
}

export async function createUser(payload: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN'; isApproved?: boolean }) {
  const res = await api.post<{ user: User }>('/api/admin/users', payload);
  return res.data.user;
}

export async function updateUser(id: string, payload: Partial<{ isApproved: boolean; isActive: boolean; role: 'USER' | 'ADMIN' }>) {
  const res = await api.patch<{ user: User }>(`/api/admin/users/${id}`, payload);
  return res.data.user;
}

export async function deleteUser(id: string) {
  await api.delete(`/api/admin/users/${id}`);
}

export async function fetchUserProgressSummary() {
  const res = await api.get('/api/admin/users/progress/summary');
  return res.data as { summaries: { id: string; name: string; email: string; completed: number; bookmarks: number; percent: number }[]; totalFiles: number };
}

export async function fetchUserDetails(id: string) {
  const res = await api.get(`/api/admin/users/${id}/progress`);
  return res.data as { bookmarks: any[]; progress: any[]; completedCount: number; totalFiles: number; percent: number };
}
