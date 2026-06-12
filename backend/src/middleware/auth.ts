import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error';
import prisma from '../config/db';

// Extend Express namespace to support typed req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'USER' | 'GUIDE' | 'ADMIN';
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: 'USER' | 'GUIDE' | 'ADMIN';
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  // 1. Extract Bearer Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication failed. Token is missing.', 401));
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;

    // 3. Find User
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Attach to Request
    req.user = user as any;
    next();
  } catch (error) {
    next(new AppError('Invalid or expired authentication token.', 401));
  }
}

// Role-Based Authorization Filter
export function authorize(...roles: Array<'USER' | 'GUIDE' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authenticated to access this route.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role (${req.user.role}) is unauthorized for this resource.`, 403));
    }

    next();
  };
}
