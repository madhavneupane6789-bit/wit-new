import { Router } from 'express';
import { generateMcqHandler } from './mcq-ai.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';

const router = Router();

router.get('/generate', requireAuth, requireApproved, generateMcqHandler);

export { router as mcqAiRoutes };
