import api from './apiClient';

export type SyllabusNode = {
  id: string;
  title: string;
  content: string;
  order: number;
  folderId?: string | null;
  children: SyllabusNode[];
};

export type SyllabusTreeResponse = {
  tree: SyllabusNode[];
};

export async function fetchSyllabusTree() {
  const res = await api.get<SyllabusTreeResponse>('/api/syllabus/tree');
  return res.data;
}

export async function createSyllabusSection(payload: {
  title: string;
  content: string;
  parentId?: string | null;
  folderId?: string | null;
  order?: number;
}) {
  const res = await api.post('/api/admin/syllabus', payload);
  return res.data.section as SyllabusNode;
}

export async function updateSyllabusSection(
  id: string,
  payload: Partial<{ title: string; content: string; parentId: string | null; folderId: string | null; order: number }>,
) {
  const res = await api.put(`/api/admin/syllabus/${id}`, payload);
  return res.data.section as SyllabusNode;
}

export async function deleteSyllabusSection(id: string) {
  const res = await api.delete(`/api/admin/syllabus/${id}`);
  return res.data;
}
