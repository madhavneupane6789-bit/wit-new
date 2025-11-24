import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { prisma } from '../config/db';

const router = Router();

const orderSchema = z.object({
  body: z.object({
    parentId: z.string().uuid().nullable().optional(),
    orderedIds: z.array(z.string().uuid()),
  }),
});

router.post('/admin/files/order', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { parentId, orderedIds } = orderSchema.parse({ body: req.body }).body;
    const updates = orderedIds.map((id, idx) =>
      prisma.file.update({
        where: { id },
        data: { order: idx, folderId: parentId ?? null },
      }),
    );
    await prisma.$transaction(updates);
    res.json({ message: 'File order updated' });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/folders/order', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { parentId, orderedIds } = orderSchema.parse({ body: req.body }).body;
    const updates = orderedIds.map((id, idx) =>
      prisma.folder.update({
        where: { id },
        data: { order: idx, parentId: parentId ?? null },
      }),
    );
    await prisma.$transaction(updates);
    res.json({ message: 'Folder order updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
