import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/token';
import { AppError } from './errorHandler';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.replace('Bearer ', '');
    const token = req.cookies?.accessToken || bearer;

    if (!token) {
      throw new AppError(401, 'Unauthorized');
    }

    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (err) {
    next(new AppError(401, 'Unauthorized'));
  }
}

export function requireRole(role: 'USER' | 'ADMIN') {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized'));
    }
    if (req.user.role !== role) {
      return next(new AppError(403, 'Forbidden'));
    }
    next();
  };
}
