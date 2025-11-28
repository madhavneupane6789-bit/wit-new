import { NextFunction, Request, Response } from 'express';
import { answerQuestion, createQuestion, listQuestions, deleteQuestion } from './mcq.service';
import { AppError } from '../middleware/errorHandler';

export async function listQuestionsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const questions = await listQuestions();
    res.json({ questions });
  } catch (err) {
    next(err);
  }
}

export async function createQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { question, optionA, optionB, optionC, optionD, correctOption, explanation } = req.body;

    if (!question || typeof question !== 'string') {
      throw new AppError(400, 'Question must be a non-empty string');
    }
    if (!optionA || typeof optionA !== 'string') {
      throw new AppError(400, 'Option A must be a non-empty string');
    }
    if (!optionB || typeof optionB !== 'string') {
      throw new AppError(400, 'Option B must be a non-empty string');
    }
    if (!optionC || typeof optionC !== 'string') {
      throw new AppError(400, 'Option C must be a non-empty string');
    }
    if (!optionD || typeof optionD !== 'string') {
      throw new AppError(400, 'Option D must be a non-empty string');
    }
    if (!['A', 'B', 'C', 'D'].includes(correctOption)) {
      throw new AppError(400, 'Correct option must be one of: A, B, C, D');
    }

    const created = await createQuestion({ question, optionA, optionB, optionC, optionD, correctOption, explanation });
    res.status(201).json({ question: created });
  } catch (err) {
    next(err);
  }
}

export async function answerQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { questionId, choice } = req.body;
    const result = await answerQuestion(questionId, choice);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await deleteQuestion(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}
