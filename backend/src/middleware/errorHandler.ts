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
  let status = (err as AppError).status || 500;
  let message = err.message || 'Internal server error';
  let details = (err as AppError).details;

  console.error(err);

  if (process.env.NODE_ENV === 'production' && status >= 500) {
    status = 500;
    message = 'Internal server error';
    details = undefined;
  }

  res.status(status).json({
    error: {
      message,
      details,
    },
  });
}
