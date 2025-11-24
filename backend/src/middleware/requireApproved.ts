import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import { AppError } from './errorHandler';

export async function requireApproved(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new AppError(401, 'Unauthorized'));
  }
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { isApproved: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return next(new AppError(403, 'Your account is inactive. Contact admin to unlock.'));
  }
  if (!user.isApproved) {
    return next(new AppError(403, 'Contact admin to unlock content.'));
  }
  next();
}
