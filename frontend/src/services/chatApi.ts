import api from './apiClient';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function sendChatMessage(message: string, history: ChatMessage[] = [], model: 'gemini' | 'deepseek' = 'gemini') {
  const res = await api.post<{ reply: string }>('/api/chat', { message, history, model });
  return res.data.reply;
}
