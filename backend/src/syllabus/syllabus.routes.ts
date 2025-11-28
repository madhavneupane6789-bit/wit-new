import { Router } from 'express';
import { z } from 'zod';
import { createSectionHandler, deleteSectionHandler, getSyllabusTreeHandler, updateSectionHandler } from './syllabus.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';
import { requireActive } from '../middleware/requireActive'; // Import new middleware

const router = Router();

const baseSchema = {
  title: z.string().min(1),
  content: z.string().min(1),
  parentId: z.string().uuid().nullable().optional(),
  folderId: z.string().uuid().nullable().optional(),
  order: z.number().int().min(0).optional(),
};

const createSchema = z.object({
  body: z.object(baseSchema),
});

const updateSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z
    .object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      parentId: z.string().uuid().nullable().optional(),
      folderId: z.string().uuid().nullable().optional(),
      order: z.number().int().min(0).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' }),
});

const idSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

router.get('/syllabus/tree', requireAuth, requireApproved, requireActive, getSyllabusTreeHandler);

router.post('/admin/syllabus', requireAuth, requireRole('ADMIN'), validateRequest(createSchema), createSectionHandler);
router.put('/admin/syllabus/:id', requireAuth, requireRole('ADMIN'), validateRequest(updateSchema), updateSectionHandler);
router.delete('/admin/syllabus/:id', requireAuth, requireRole('ADMIN'), validateRequest(idSchema), deleteSectionHandler);

export default router;
