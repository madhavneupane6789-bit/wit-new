import { Request, Response, NextFunction } from 'express';
import { generateMcqQuestion } from './mcq-ai.service';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

// Schema for validating query parameters for generating MCQ questions
const generateMcqSchema = z.object({
  query: z.object({
    topic: z.string().optional(),
  }),
});

export async function generateMcqQuestionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic } = req.query; // Topic is optional, service will default to 'Loksewa General Knowledge'
    
    // Validate request using Zod schema
    const validatedQuery = generateMcqSchema.parse(req);
    const questionTopic = validatedQuery.query.topic as string | undefined;

    const mcqQuestion = await generateMcqQuestion(questionTopic);
    res.json(mcqQuestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, 'Invalid query parameters: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}