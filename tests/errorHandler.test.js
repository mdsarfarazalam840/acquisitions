import { jest } from '@jest/globals';
import errorHandler from '../src/middleware/errorHandler.js';
import {
  AppError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../src/errors/AppError.js';

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const baseReq = {
  path: '/api/test',
  method: 'GET',
  ip: '127.0.0.1',
};

describe('errorHandler middleware', () => {
  it('handles AppError with details', () => {
    const req = { ...baseReq };
    const res = createRes();
    const err = new ValidationError('Bad payload', [{ field: 'email' }]);

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Bad payload',
        details: [{ field: 'email' }],
      },
    });
  });

  it('handles ZodError payloads', () => {
    const req = { ...baseReq };
    const res = createRes();
    const err = { name: 'ZodError', errors: [{ message: 'invalid' }] };

    errorHandler(err, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: [{ message: 'invalid' }],
      },
    });
  });

  it('handles JWT errors', () => {
    const req = { ...baseReq };
    const res = createRes();

    errorHandler({ name: 'JsonWebTokenError' }, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Invalid token',
      },
    });
  });

  it('handles expired token errors', () => {
    const req = { ...baseReq };
    const res = createRes();

    errorHandler({ name: 'TokenExpiredError' }, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Token expired',
      },
    });
  });

  it('handles postgres unique violation errors', () => {
    const req = { ...baseReq };
    const res = createRes();

    errorHandler({ code: '23505' }, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'CONFLICT_ERROR',
        message: 'Resource already exists',
      },
    });
  });

  it('handles unknown errors as 500', () => {
    const req = { ...baseReq };
    const res = createRes();

    errorHandler(new Error('Boom'), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });

  it('uses statusCode on non-500 unknown errors', () => {
    const req = { ...baseReq };
    const res = createRes();
    const err = new Error('Teapot');
    err.statusCode = 418;

    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Teapot',
      },
    });
  });
});

describe('AppError classes', () => {
  it('creates base AppError correctly', () => {
    const err = new AppError('Base', 499, 'BASE_ERROR');
    expect(err.message).toBe('Base');
    expect(err.statusCode).toBe(499);
    expect(err.code).toBe('BASE_ERROR');
    expect(err.isOperational).toBe(true);
  });

  it('creates typed error variants', () => {
    const validation = new ValidationError('Invalid', [{ field: 'name' }]);
    const auth = new AuthError();
    const forbidden = new ForbiddenError();
    const notFound = new NotFoundError();
    const conflict = new ConflictError();

    expect(validation.statusCode).toBe(400);
    expect(validation.code).toBe('VALIDATION_ERROR');
    expect(validation.details).toEqual([{ field: 'name' }]);

    expect(auth.statusCode).toBe(401);
    expect(auth.code).toBe('AUTH_ERROR');

    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.code).toBe('FORBIDDEN_ERROR');

    expect(notFound.statusCode).toBe(404);
    expect(notFound.code).toBe('NOT_FOUND_ERROR');

    expect(conflict.statusCode).toBe(409);
    expect(conflict.code).toBe('CONFLICT_ERROR');
  });
});
