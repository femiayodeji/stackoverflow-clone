import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async Express handler and forwards any rejection to next()
 * so the global error handler can process it.
 *
 * Usage:
 *   router.post('/register', catchAsync(authController.register));
 */
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};