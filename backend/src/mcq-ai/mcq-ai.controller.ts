import { NextFunction, Request, Response } from 'express';
import { generateMcqQuestion } from './mcq-ai.service';
import { AppError } from '../middleware/errorHandler';

export async function generateMcqHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic } = req.query;

    if (!topic || typeof topic !== 'string') {
      throw new AppError(400, 'Topic is required for MCQ generation.');
    }

    const mcq = await generateMcqQuestion(topic);
    res.json(mcq);
  } catch (err) {
    next(err);
  }
}
