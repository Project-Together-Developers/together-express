import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler';

type RequestTarget = 'body' | 'params' | 'query';

export function validate<T>(schema: ZodSchema<T>, target: RequestTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const message = (result.error as ZodError).issues
        .map((issue) => issue.message)
        .join(', ');
      return next(new AppError(400, message));
    }
    req[target] = result.data;
    next();
  };
}
