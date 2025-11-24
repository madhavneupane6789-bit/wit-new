import { Router } from 'express';
import { z } from 'zod';
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from './auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    school: z.string().optional(),
    preparingFor: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10),
    newPassword: z.string().min(6),
  }),
});

router.post('/register', validateRequest(registerSchema), registerHandler);
router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/logout', logoutHandler);
router.post('/refresh', refreshHandler);
router.get('/me', requireAuth, meHandler);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPasswordHandler);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPasswordHandler);

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});
router.post('/change-password', requireAuth, validateRequest(changePasswordSchema), changePasswordHandler);

export default router;
