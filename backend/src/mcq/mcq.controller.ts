import { NextFunction, Request, Response } from 'express';
import { answerQuestion, createQuestion, listQuestions, deleteQuestion } from './mcq.service';

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
