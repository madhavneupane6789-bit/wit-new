import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function requireActive(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new AppError(401, 'Unauthorized');
  }

  // Admin users should always pass this check
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Only block users with 'INACTIVE' status
  if (req.user.status === 'INACTIVE') {
    throw new AppError(403, 'Access denied. Your account is inactive. Please contact support.');
  }

  // Allow PENDING and ACTIVE non-admin users to proceed to the dashboard
  next();
}
