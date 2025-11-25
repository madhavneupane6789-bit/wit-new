import { Router } from 'express';
import { z } from 'zod';
import { listQuestionsHandler, createQuestionHandler, answerQuestionHandler, deleteQuestionHandler } from './mcq.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';

const router = Router();

const createSchema = z.object({
  body: z.object({
    question: z.string().min(1),
    optionA: z.string().min(1),
    optionB: z.string().min(1),
    optionC: z.string().min(1),
    optionD: z.string().min(1),
    correctOption: z.enum(['A', 'B', 'C', 'D']),
    explanation: z.string().optional(),
  }),
});

const answerSchema = z.object({
  body: z.object({
    questionId: z.string().uuid(),
    choice: z.enum(['A', 'B', 'C', 'D']),
  }),
});

const idSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

router.get('/mcq', requireAuth, requireApproved, listQuestionsHandler);
router.post('/mcq/answer', requireAuth, requireApproved, validateRequest(answerSchema), answerQuestionHandler);

router.post('/admin/mcq', requireAuth, requireRole('ADMIN'), validateRequest(createSchema), createQuestionHandler);
router.delete('/admin/mcq/:id', requireAuth, requireRole('ADMIN'), validateRequest(idSchema), deleteQuestionHandler);

export default router;
