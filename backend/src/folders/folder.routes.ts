import { Router } from 'express';
import { z } from 'zod';
import {
  createFolderHandler,
  deleteFolderHandler,
  getFolderTreeHandler,
  updateFolderHandler,
} from './folder.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';
import { requireActive } from '../middleware/requireActive'; // Import new middleware

const router = Router();

const createSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    parentId: z.string().uuid().optional(),
  }),
});

const updateSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
    })
    .refine((data) => data.name !== undefined || data.description !== undefined, {
      message: 'At least one field must be provided',
    }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

router.get('/folders/tree', requireAuth, requireApproved, requireActive, getFolderTreeHandler);

router.get('/admin/folders/tree', requireAuth, requireRole('ADMIN'), getFolderTreeHandler);
router.post('/admin/folders', requireAuth, requireRole('ADMIN'), validateRequest(createSchema), createFolderHandler);
router.put('/admin/folders/:id', requireAuth, requireRole('ADMIN'), validateRequest(updateSchema), updateFolderHandler);
router.delete('/admin/folders/:id', requireAuth, requireRole('ADMIN'), validateRequest(idSchema), deleteFolderHandler);

export default router;
