import { AppError } from '../AppError';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from '../HttpError';

describe('AppError', () => {
  it('should create an error with correct message and statusCode', () => {
    const error = new AppError('Something went wrong', 400);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('test', 500);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should capture a stack trace', () => {
    const error = new AppError('test', 400);
    expect(error.stack).toBeDefined();
  });
});

describe('HttpError subclasses', () => {
  it('BadRequestError should have statusCode 400', () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad request');
  });

  it('NotFoundError should have statusCode 404', () => {
    const error = new NotFoundError('Question not found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Question not found');
  });

  it('UnauthorizedError should have statusCode 401', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
  });

  it('ConflictError should have statusCode 409', () => {
    const error = new ConflictError('Email already exists');
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Email already exists');
  });
});