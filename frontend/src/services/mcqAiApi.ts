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

export async function generateMcqQuestion(topic: string): Promise<McqQuestionResponse> {
  const response = await api.get<McqQuestionResponse>('/api/mcq-ai/generate', {
    params: { topic },
  });
  return response.data;
}
