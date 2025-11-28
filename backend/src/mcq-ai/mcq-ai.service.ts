import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

const genAI = new GoogleGenerativeAI(env.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface McqQuestionResponse {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export async function generateMcqQuestion(topic: string): Promise<McqQuestionResponse> {
  if (!env.geminiApiKey) {
    throw new AppError(500, 'Gemini API key is not configured.');
  }

  const prompt = `Generate a Loksewa level multiple-choice question on the topic of "${topic}".
The question should have 4 options (A, B, C, D).
Provide the correct answer letter (A, B, C, or D).
Provide a detailed explanation for the correct answer.

Format your response as a JSON object with the following structure:
{
  "question": "The question text",
  "options": {
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  },
  "correctAnswer": "A", // Or B, C, D
  "explanation": "Detailed explanation for the correct answer."
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Attempt to parse the JSON response
    const mcq: McqQuestionResponse = JSON.parse(text);

    // Basic validation
    if (!mcq.question || !mcq.options || !mcq.correctAnswer || !mcq.explanation) {
      throw new Error('Invalid MCQ structure received from Gemini API');
    }
    if (!['A', 'B', 'C', 'D'].includes(mcq.correctAnswer)) {
      throw new Error('Invalid correct answer format received from Gemini API');
    }

    return mcq;
  } catch (error: any) {
    console.error('Error generating MCQ:', error);
    throw new AppError(500, `Failed to generate MCQ question: ${error.message}`);
  }
}
