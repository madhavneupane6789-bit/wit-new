import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { prisma } from '../config/db';

const router = Router();

router.get('/announcement', requireAuth, async (_req, res, next) => {
  try {
    const message = await prisma.announcement.findFirst({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ message });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/announcement', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const body = z.object({ content: z.string().min(1), active: z.boolean().optional() }).parse(req.body);
    const announcement = await prisma.announcement.create({
      data: {
        content: body.content,
        active: body.active ?? true,
        createdBy: req.user?.id,
      },
    });
    res.status(201).json({ announcement });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/announcement/:id', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const params = z.object({ id: z.string().uuid() }).parse(req.params);
    const body = z.object({ content: z.string().min(1), active: z.boolean().optional() }).parse(req.body);
    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: { content: body.content, active: body.active ?? true },
    });
    res.json({ announcement });
  } catch (err) {
    next(err);
  }
});

export default router;
