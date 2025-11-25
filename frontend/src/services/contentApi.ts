import api from './apiClient';

export type FileItem = {
  id: string;
  name: string;
  description?: string | null;
  fileType: 'VIDEO' | 'PDF';
  googleDriveUrl: string;
  folderId?: string | null;
  bookmarked?: boolean;
  completed?: boolean;
  lastOpenedAt?: string | null;
};

export type FolderNode = {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  children: FolderNode[];
  syllabusSections?: { id: string; title: string }[];
  files: FileItem[];
};

export type FolderTreeResponse = {
  tree: FolderNode[];
  rootFiles: FileItem[];
  progress?: number;
};

export async function fetchUserTree() {
  const res = await api.get<FolderTreeResponse>('/api/folders/tree');
  return res.data;
}

export async function fetchAdminTree() {
  const res = await api.get<FolderTreeResponse>('/api/admin/folders/tree');
  return res.data;
}

export async function createFolder(payload: { name: string; description?: string; parentId?: string }) {
  const res = await api.post('/api/admin/folders', payload);
  return res.data.folder;
}

export async function updateFolder(id: string, payload: { name?: string; description?: string }) {
  const res = await api.put(`/api/admin/folders/${id}`, payload);
  return res.data.folder;
}

export async function deleteFolder(id: string) {
  const res = await api.delete(`/api/admin/folders/${id}`);
  return res.data;
}

export async function createFile(payload: {
  name: string;
  description?: string;
  fileType: 'VIDEO' | 'PDF';
  googleDriveUrl: string;
  folderId?: string | null;
}) {
  const res = await api.post('/api/admin/files', payload);
  return res.data.file as FileItem;
}

export async function updateFile(
  id: string,
  payload: Partial<{
    name: string;
    description?: string;
    fileType: 'VIDEO' | 'PDF';
    googleDriveUrl: string;
    folderId?: string | null;
  }>,
) {
  const res = await api.put(`/api/admin/files/${id}`, payload);
  return res.data.file as FileItem;
}

export async function deleteFile(id: string) {
  const res = await api.delete(`/api/admin/files/${id}`);
  return res.data;
}

// Ordering
export async function reorderFiles(parentId: string | null, orderedIds: string[]) {
  const res = await api.post('/api/admin/files/order', { parentId, orderedIds });
  return res.data;
}

export async function reorderFolders(parentId: string | null, orderedIds: string[]) {
  const res = await api.post('/api/admin/folders/order', { parentId, orderedIds });
  return res.data;
}

// Bookmarks
export async function addBookmark(fileId: string) {
  const res = await api.post('/api/bookmarks', { fileId });
  return res.data;
}

export async function removeBookmark(fileId: string) {
  const res = await api.delete(`/api/bookmarks/${fileId}`);
  return res.data;
}

export async function listBookmarks() {
  const res = await api.get('/api/bookmarks');
  return res.data.bookmarks as { fileId: string; file: FileItem }[];
}

// Progress
export async function setProgress(fileId: string, completed: boolean) {
  const res = await api.post('/api/progress', { fileId, completed });
  return res.data;
}

export async function markOpened(fileId: string) {
  const res = await api.post('/api/progress/open', { fileId });
  return res.data;
}

// Announcement
export async function fetchAnnouncement() {
  const res = await api.get('/api/announcement');
  return res.data.message as { content: string } | null;
}

export async function setAnnouncement(content: string, active = true) {
  const res = await api.post('/api/admin/announcement', { content, active });
  return res.data.announcement as { id: string; content: string; active: boolean };
}

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/api/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data as { url: string };
}

export async function uploadMedia(file: File, label?: string) {
  const form = new FormData();
  form.append('file', file);
  if (label) form.append('label', label);
  const res = await api.post('/api/admin/upload/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data.asset as { id: string; url: string; label?: string };
}
