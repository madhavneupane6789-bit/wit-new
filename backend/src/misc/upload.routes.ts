import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { requireAuth, requireRole } from '../middleware/requireAuth';
import { prisma } from '../config/db';
import { AppError } from '../middleware/errorHandler';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => cb(null, 'uploads'),
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

type UploadRequest = Request & { file?: Express.Multer.File };

router.post('/upload/avatar', requireAuth, upload.single('file'), async (req: UploadRequest, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });
    const url = `/uploads/${req.file.filename}`;
    await prisma.user.update({ where: { id: req.user!.id }, data: { avatarUrl: url } });
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/admin/upload/media',
  requireAuth,
  requireRole('ADMIN'),
  upload.single('file'),
  async (req: UploadRequest, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });
      const url = `/uploads/${req.file.filename}`;
      const asset = await prisma.mediaAsset.create({
        data: { url, label: req.body.label, createdBy: req.user?.id },
      });
      res.json({ asset });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
