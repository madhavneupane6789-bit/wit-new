import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { prisma } from '../config/db';

const router = Router();

router.get('/admin/users/:id/progress', requireAuth, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const userId = req.params.id;
    const totalFiles = await prisma.file.count();
    const [bookmarks, progress] = await Promise.all([
      prisma.bookmark.findMany({ where: { userId }, include: { file: true } }),
      prisma.fileProgress.findMany({ where: { userId }, include: { file: true } }),
    ]);
    const completedCount = progress.filter((p) => p.completed).length;
    const pct = totalFiles ? Math.round((completedCount / totalFiles) * 100) : 0;
    res.json({ bookmarks, progress, completedCount, totalFiles, percent: pct });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/users/progress/summary', requireAuth, requireRole('ADMIN'), async (_req, res, next) => {
  try {
    const totalFiles = await prisma.file.count();
    const summaries = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        progress: { where: { completed: true }, select: { id: true } },
        bookmarks: { select: { id: true } },
      },
    });
    const normalized = summaries.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      completed: s.progress.length,
      bookmarks: s.bookmarks.length,
      percent: totalFiles ? Math.round((s.progress.length / totalFiles) * 100) : 0,
    }));
    res.json({ summaries: normalized, totalFiles });
  } catch (err) {
    next(err);
  }
});

export default router;
