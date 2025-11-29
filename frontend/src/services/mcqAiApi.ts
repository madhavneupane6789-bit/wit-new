import api from './apiClient';

export type McqQuestionResponse = {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
};

export async function generateMcqQuestion(params: { topic: string; model: 'gemini' | 'deepseek' }): Promise<McqQuestionResponse> {
  const response = await api.post<McqQuestionResponse>('/mcq-ai/generate', params);
  return response.data;
}
