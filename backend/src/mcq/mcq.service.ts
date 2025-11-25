import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

export async function listQuestions() {
  const questions = await prisma.mCQQuestion.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return questions;
}

export async function createQuestion(data: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}) {
  return prisma.mCQQuestion.create({ data });
}

export async function answerQuestion(questionId: string, choice: 'A' | 'B' | 'C' | 'D') {
  const question = await prisma.mCQQuestion.findUnique({ where: { id: questionId } });
  if (!question) throw new AppError(404, 'Question not found');
  const isCorrect = question.correctOption === choice;
  return {
    correct: isCorrect,
    correctOption: question.correctOption,
    explanation: question.explanation,
  };
}

export async function deleteQuestion(id: string) {
  const exists = await prisma.mCQQuestion.findUnique({ where: { id } });
  if (!exists) throw new AppError(404, 'Question not found');
  await prisma.mCQQuestion.delete({ where: { id } });
  return true;
}
