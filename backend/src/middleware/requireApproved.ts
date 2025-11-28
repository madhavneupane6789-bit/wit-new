import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/db';
import { AppError } from './errorHandler';

export async function requireApproved(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new AppError(401, 'Unauthorized'));
  }

  // Admin users should always pass this check
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // For non-admin users, we will fetch their latest approval status
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { isApproved: true, isActive: true, status: true }, // Select status as well for consistency
  });

  // Attach the actual approval status to req.user for frontend to use.
  // The frontend will use this to determine content access for PENDING users.
  // The 'requireActive' middleware already handles genuinely inactive accounts.
  if (user) {
    req.user.isApproved = user.isApproved;
    // Also update isActive, as the default type definition might not reflect the actual DB value if changed
    req.user.isActive = user.isActive; 
  } else {
    // This case should ideally not be reached if requireAuth runs before, but for safety
    req.user.isApproved = false;
    req.user.isActive = false;
  }


  next();
}
