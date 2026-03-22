import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { BadRequestError } from '@/shared/errors';

/**
 * Generic Zod validation middleware.
 * Parses req.body against the provided schema.
 * Returns 400 with field-level error details on failure.
 *
 * Usage:
 *   router.post('/register', validate(RegisterSchema), controller.register);
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((e: ZodIssue) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return next(new BadRequestError(message));
      }
      next(err);
    }
  };
};