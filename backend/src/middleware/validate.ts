import { Request, Response, NextFunction } from 'express';
import { AppError } from './error';

// Middleware to validate presence of body parameters
export function validateBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter(field => {
      const val = req.body[field];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      return next(new AppError(`Bad Request. Missing parameters: ${missing.join(', ')}`, 400));
    }

    next();
  };
}

// Custom email/phone validator utility
export function validateEmail(req: Request, res: Response, next: NextFunction) {
  const email = req.body.email;
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Invalid email format. Please check input.', 400));
    }
  }
  next();
}
