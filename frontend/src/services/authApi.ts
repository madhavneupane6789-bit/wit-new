import api from './apiClient';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isApproved: boolean;
  isActive: boolean;
  phone?: string | null;
  school?: string | null;
  preparingFor?: string | null;
  avatarUrl?: string | null;
};

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  school?: string;
  preparingFor?: string;
  avatarUrl?: string;
}) {
  const res = await api.post<{ user: User }>('/api/auth/register', payload);
  return res.data.user;
}

export async function login(payload: { email: string; password: string }) {
  const res = await api.post<{ user: User }>('/api/auth/login', payload);
  return res.data.user;
}

export async function logout() {
  await api.post('/api/auth/logout');
}

export async function refresh() {
  const res = await api.post<{ user: User }>('/api/auth/refresh');
  return res.data.user;
}

export async function me() {
  const res = await api.get<{ user: User }>('/api/auth/me');
  return res.data.user;
}

export async function forgotPassword(email: string) {
  const res = await api.post('/api/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(payload: { token: string; newPassword: string }) {
  const res = await api.post('/api/auth/reset-password', payload);
  return res.data;
}

export async function changePassword(payload: { oldPassword: string; newPassword: string }) {
  const res = await api.post('/api/auth/change-password', payload);
  return res.data;
}
