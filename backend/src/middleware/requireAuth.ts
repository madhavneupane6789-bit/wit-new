import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/token';
import { AppError } from './errorHandler';
import { prisma } from '../config/db';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.replace('Bearer ', '');
    const token = req.cookies?.accessToken || bearer;

    if (!token) {
      console.warn('requireAuth: no token found (cookie or bearer)');
      throw new AppError(401, 'Unauthorized');
    }

    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isApproved: true,
        isActive: true,
        subscriptionEndDate: true,
        subscriptionStatus: true,
      },
    });

    if (!user) {
      console.warn('requireAuth: token valid but user missing in DB');
      throw new AppError(401, 'Unauthorized');
    }

    // Attach full user context; downstream middlewares can apply stricter rules.
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      isApproved: user.isApproved,
      isActive: user.isActive,
      subscriptionEndDate: user.subscriptionEndDate ?? undefined,
      subscriptionStatus: user.subscriptionStatus,
    };
    next();
  } catch (err) {
    console.warn('requireAuth: token verification failed');
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
