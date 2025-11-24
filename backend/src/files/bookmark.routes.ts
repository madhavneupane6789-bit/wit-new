import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth';
import { requireApproved } from '../middleware/requireApproved';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const fileIdSchema = z.object({
  body: z.object({ fileId: z.string().uuid() }),
});

const paramIdSchema = z.object({
  params: z.object({ fileId: z.string().uuid() }),
});

router.post('/bookmarks', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { fileId } = fileIdSchema.parse({ body: req.body }).body;
    await prisma.bookmark.upsert({
      where: { userId_fileId: { userId: req.user!.id, fileId } },
      update: {},
      create: { userId: req.user!.id, fileId },
    });
    res.status(201).json({ message: 'Bookmarked' });
  } catch (err) {
    next(err);
  }
});

router.delete('/bookmarks/:fileId', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const { fileId } = paramIdSchema.parse({ params: req.params }).params;
    await prisma.bookmark.deleteMany({ where: { userId: req.user!.id, fileId } });
    res.json({ message: 'Removed bookmark' });
  } catch (err) {
    next(err);
  }
});

router.get('/bookmarks', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const items = await prisma.bookmark.findMany({
      where: { userId: req.user!.id },
      include: { file: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ bookmarks: items });
  } catch (err) {
    next(err);
  }
});

router.post('/progress', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const body = z
      .object({
        fileId: z.string().uuid(),
        completed: z.boolean(),
      })
      .parse(req.body);
    await prisma.fileProgress.upsert({
      where: { userId_fileId: { userId: req.user!.id, fileId: body.fileId } },
      update: { completed: body.completed, lastOpenedAt: new Date() },
      create: { userId: req.user!.id, fileId: body.fileId, completed: body.completed, lastOpenedAt: new Date() },
    });
    res.json({ message: 'Progress updated' });
  } catch (err) {
    next(err);
  }
});

router.post('/progress/open', requireAuth, requireApproved, async (req, res, next) => {
  try {
    const body = z.object({ fileId: z.string().uuid() }).parse(req.body);
    await prisma.fileProgress.upsert({
      where: { userId_fileId: { userId: req.user!.id, fileId: body.fileId } },
      update: { lastOpenedAt: new Date() },
      create: { userId: req.user!.id, fileId: body.fileId, lastOpenedAt: new Date() },
    });
    res.json({ message: 'Last opened updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
