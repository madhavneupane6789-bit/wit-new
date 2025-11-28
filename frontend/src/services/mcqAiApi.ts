import axios from 'axios';
import { McqQuestionResponse } from '../pages/MCQAI'; // Assuming type is defined there. Consider moving to a shared types file.

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function generateMcqQuestion(topic: string): Promise<McqQuestionResponse> {
  const response = await axios.get<McqQuestionResponse>(`${API_URL}/mcq-ai/generate`, {
    params: { topic },
    withCredentials: true,
  });
  return response.data;
}
