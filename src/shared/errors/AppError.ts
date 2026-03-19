export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);

    // Restore prototype chain broken by extending built-in Error
    Object.setPrototypeOf(this, AppError.prototype);
  }
}