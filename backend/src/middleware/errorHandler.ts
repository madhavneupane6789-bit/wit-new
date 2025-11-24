import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = (err as AppError).status || 500;
  const message = err.message || 'Internal server error';
  const details = (err as AppError).details;

  console.error(err);
  res.status(status).json({
    error: {
      message,
      details,
    },
  });
}
