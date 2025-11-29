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

export async function suggestQuestion(data: {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  submittedById?: string;
}) {
  return prisma.mCQSuggestion.create({
    data: {
      question: data.question,
      optionA: data.optionA,
      optionB: data.optionB,
      optionC: data.optionC,
      optionD: data.optionD,
      correctOption: data.correctOption as any,
      explanation: data.explanation,
      submittedById: data.submittedById,
    },
  });
}

export async function listSuggestions(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  return prisma.mCQSuggestion.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { submittedBy: { select: { id: true, name: true, email: true } } },
  });
}

export async function approveSuggestion(id: string, adminId?: string) {
  const suggestion = await prisma.mCQSuggestion.findUnique({ where: { id } });
  if (!suggestion) throw new AppError(404, 'Suggestion not found');
  if (suggestion.status !== 'PENDING') {
    throw new AppError(400, 'Suggestion already processed');
  }

  const created = await prisma.$transaction(async (tx) => {
    const question = await tx.mCQQuestion.create({
      data: {
        question: suggestion.question,
        optionA: suggestion.optionA,
        optionB: suggestion.optionB,
        optionC: suggestion.optionC,
        optionD: suggestion.optionD,
        correctOption: suggestion.correctOption,
        explanation: suggestion.explanation,
      },
    });

    await tx.mCQSuggestion.update({
      where: { id },
      data: { status: 'APPROVED', approvedAt: new Date(), approvedById: adminId },
    });
    return question;
  });

  return created;
}

export async function rejectSuggestion(id: string, adminId?: string) {
  const suggestion = await prisma.mCQSuggestion.findUnique({ where: { id } });
  if (!suggestion) throw new AppError(404, 'Suggestion not found');
  if (suggestion.status !== 'PENDING') {
    throw new AppError(400, 'Suggestion already processed');
  }

  await prisma.mCQSuggestion.update({
    where: { id },
    data: { status: 'REJECTED', approvedAt: new Date(), approvedById: adminId },
  });

  return true;
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
