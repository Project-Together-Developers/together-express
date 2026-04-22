import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ message: err.message, path: req.path, method: req.method, stack: err.stack });
    }
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  logger.error({ message: err.message, path: req.path, method: req.method, stack: err.stack });
  res.status(500).json({ success: false, error: 'Internal server error' });
}
