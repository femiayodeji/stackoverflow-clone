import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../shared/errors';
import { JwtPayload } from '../modules/auth/auth.service';

/**
 * Extends Express Request to include the authenticated user payload.
 * Available as req.user in any protected route handler.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Protects routes by verifying the JWT token in the Authorization header.
 * Attaches the decoded payload to req.user on success.
 */
export const protect = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (err) {
    // JsonWebTokenError and TokenExpiredError are handled
    // by the global error handler
    next(err);
  }
};