import api from './apiClient';

export type MCQQuestion = {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string | null;
};

export async function fetchMcqQuestions() {
  const res = await api.get<{ questions: MCQQuestion[] }>('/api/mcq');
  return res.data.questions;
}

export async function submitMcqAnswer(questionId: string, choice: 'A' | 'B' | 'C' | 'D') {
  const res = await api.post<{ correct: boolean; correctOption: string; explanation?: string }>('/api/mcq/answer', {
    questionId,
    choice,
  });
  return res.data;
}

export async function adminCreateMcq(payload: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}) {
  const res = await api.post('/api/admin/mcq', payload);
  return res.data.question as MCQQuestion;
}

export async function adminDeleteMcq(id: string) {
  const res = await api.delete(`/api/admin/mcq/${id}`);
  return res.data;
}

export type MCQSuggestion = MCQQuestion & {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy?: { id: string; name: string; email: string } | null;
  createdAt?: string;
};

export async function suggestMcq(payload: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}) {
  const res = await api.post('/api/mcq/suggest', payload);
  return res.data.suggestion as MCQSuggestion;
}

export async function adminListSuggestions() {
  const res = await api.get<{ suggestions: MCQSuggestion[] }>('/api/admin/mcq/suggestions');
  return res.data.suggestions;
}

export async function adminApproveSuggestion(id: string) {
  const res = await api.post<{ question: MCQQuestion }>(`/api/admin/mcq/suggestions/${id}/approve`);
  return res.data.question;
}

export async function adminRejectSuggestion(id: string) {
  const res = await api.post(`/api/admin/mcq/suggestions/${id}/reject`);
  return res.data;
}
