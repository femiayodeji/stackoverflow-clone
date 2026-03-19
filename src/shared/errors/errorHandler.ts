import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import logger from '../logger';

interface ErrorResponse {
  status: 'error' | 'fail';
  statusCode: number;
  message: string;
  stack?: string;
}

/**
 * Handles Sequelize validation errors and maps them to AppError shape
 */
const handleSequelizeValidationError = (err: any): AppError => {
  const message = err.errors.map((e: any) => e.message).join(', ');
  return new AppError(message, 422);
};

/**
 * Handles Sequelize unique constraint violations
 */
const handleSequelizeUniqueConstraintError = (err: any): AppError => {
  const field = err.errors[0]?.path ?? 'field';
  return new AppError(`${field} already exists`, 409);
};

/**
 * Handles expired JWT tokens
 */
const handleJwtExpiredError = (): AppError =>
  new AppError('Your session has expired. Please log in again', 401);

/**
 * Handles invalid JWT tokens
 */
const handleJwtInvalidError = (): AppError =>
  new AppError('Invalid token. Please log in again', 401);

/**
 * Sends detailed error response in development
 */
const sendDevError = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.statusCode >= 500 ? 'error' : 'fail',
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Sends sanitized error response in production
 * Non-operational errors return a generic message to avoid leaking internals
 */
const sendProdError = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? 'error' : 'fail',
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    // Unknown error — log it but don't leak details to client
    logger.error('Unexpected error', {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Global Express error handling middleware.
 * Must be registered LAST in app.ts after all routes.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  err.statusCode = err.statusCode ?? 500;

  logger.error(err.message, {
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  let error = err;

  // Map known third-party errors to AppError
  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleSequelizeUniqueConstraintError(err);
  } else if (err.name === 'TokenExpiredError') {
    error = handleJwtExpiredError();
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJwtInvalidError();
  } else if (!(err instanceof AppError)) {
    // Wrap unknown errors so sendProdError handles them correctly
    error = new AppError(err.message ?? 'Something went wrong', err.statusCode ?? 500);
    error.isOperational = false;
  }

  if (process.env.NODE_ENV === 'development') {
    sendDevError(error, res);
  } else {
    sendProdError(error, res);
  }
};