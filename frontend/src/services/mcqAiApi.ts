import api from './apiClient';
import { McqQuestionResponse } from '../../backend/src/mcq-ai/mcq-ai.service'; // Adjust path as needed

export async function generateAiMcq(topic: string): Promise<McqQuestionResponse> {
  const res = await api.get<McqQuestionResponse>(`/api/mcq-ai/generate?topic=${encodeURIComponent(topic)}`);
  return res.data;
}