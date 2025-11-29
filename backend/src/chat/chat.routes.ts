import { Router } from 'express';
import { chatHandler } from './chat.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';
import { requireActive } from '../middleware/requireActive';

const router = Router();

router.post('/chat', requireAuth, requireApproved, requireActive, chatHandler);

export default router;
