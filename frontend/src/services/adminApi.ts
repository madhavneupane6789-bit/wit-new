import api from './apiClient';
import { User } from './authApi';

export const FileType = {
  VIDEO: 'VIDEO',
  PDF: 'PDF',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];

export interface File {
  id: string;
  name: string;
  description: string | null;
  fileType: FileType;
  googleDriveUrl: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  folder: {
    id: string;
    name: string;
  } | null;
}

export async function listAllFiles() {
  const res = await api.get<{ files: File[] }>('/api/admin/files/all');
  return res.data.files;
}

export async function updateFile(id: string, payload: Partial<{ name: string; description: string; fileType: FileType; googleDriveUrl: string }>) {
  const res = await api.put<{ file: File }>(`/api/admin/files/${id}`, payload);
  return res.data.file;
}

export async function deleteFile(id: string) {
  await api.delete(`/api/admin/files/${id}`);
}

export async function createFile(payload: Partial<{ name: string; description: string; fileType: FileType; googleDriveUrl: string; folderId: string }>) {
  const res = await api.post<{ file: File }>('/api/admin/files', payload);
  return res.data.file;
}

export async function listUsers() {
  const res = await api.get<{ users: User[] }>('/api/admin/users');
  return res.data.users;
}

export async function createUser(payload: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) {
  const res = await api.post<{ user: User }>('/api/admin/users', payload);
  return res.data.user;
}

export async function updateUser(
  id: string,
  payload: Partial<{
    name: string;
    email: string;
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    isApproved: boolean;
    isActive: boolean;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
    subscriptionStatus: 'FREE' | 'BASIC' | 'PREMIUM';
    role: 'USER' | 'ADMIN';
    phone: string;
    school: string;
    preparingFor: string;
    avatarUrl: string | null;
  }>,
) {
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
