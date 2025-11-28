import { Router } from 'express';
import { generateMcqQuestionHandler } from './mcq-ai.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';
import { requireActive } from '../middleware/requireActive'; // Import new middleware

const router = Router();

router.get('/generate', requireAuth, requireApproved, requireActive, generateMcqQuestionHandler);

export { router as mcqAiRoutes };
