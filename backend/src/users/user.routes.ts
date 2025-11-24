import { Router } from 'express';
import { z } from 'zod';
import { createUserHandler, deleteUserHandler, listUsersHandler, updateUserHandler } from './user.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth, requireRole } from '../middleware/requireAuth';

const router = Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['USER', 'ADMIN']).optional(),
    isApproved: z.boolean().optional(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    isApproved: z.boolean().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

router.get('/admin/users', requireAuth, requireRole('ADMIN'), listUsersHandler);
router.post('/admin/users', requireAuth, requireRole('ADMIN'), validateRequest(createSchema), createUserHandler);
router.patch('/admin/users/:id', requireAuth, requireRole('ADMIN'), validateRequest(updateSchema), updateUserHandler);
router.delete('/admin/users/:id', requireAuth, requireRole('ADMIN'), validateRequest(idSchema), deleteUserHandler);

export default router;
