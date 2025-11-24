import { Router } from 'express';
import { z } from 'zod';
import {
  createFileHandler,
  deleteFileHandler,
  getFileHandler,
  listFilesHandler,
  updateFileHandler,
} from './file.controller';
import { validateRequest } from '../middleware/validateRequest';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';

const router = Router();

const fileBody = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fileType: z.enum(['VIDEO', 'PDF']),
  googleDriveUrl: z.string().url(),
  folderId: z.string().uuid().nullable().optional(),
});

const idSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

router.get('/files', requireAuth, requireApproved, listFilesHandler);
router.get('/files/:id', requireAuth, requireApproved, validateRequest(idSchema), getFileHandler);

router.post('/admin/files', requireAuth, requireRole('ADMIN'), validateRequest(z.object({ body: fileBody })), createFileHandler);
router.put(
  '/admin/files/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(
    z.object({
      params: z.object({ id: z.string().uuid() }),
      body: fileBody.partial().refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field required',
      }),
    }),
  ),
  updateFileHandler,
);
router.delete('/admin/files/:id', requireAuth, requireRole('ADMIN'), validateRequest(idSchema), deleteFileHandler);

export default router;
