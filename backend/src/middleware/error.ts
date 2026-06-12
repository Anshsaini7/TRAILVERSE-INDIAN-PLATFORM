import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let error = { ...err };
  error.message = err.message;

  // Log detailed error for developers
  if (process.env.NODE_ENV === 'development') {
    console.error('⨯ Error Middleware:', err);
  }

  // Prisma unique constraint validation
  if (err.code === 'P2002') {
    const fields = err.meta?.target || ['field'];
    error = new AppError(`Duplicate field value entered for: ${fields.join(', ')}`, 400);
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    error = new AppError('Record not found in the database', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please authenticate again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired. Please login again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
