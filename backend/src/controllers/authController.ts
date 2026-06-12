import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import redisClient from '../config/redis';
import { AppError } from '../middleware/error';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

// Helper to sign JWT
const signToken = (payload: { id: string; email: string; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const AuthController = {
  /**
   * Register a new user
   */
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password, role } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(new AppError('User with this email already exists', 400));
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: role || 'USER'
        }
      });

      // Sign JWT
      const token = signToken({ id: user.id, email: user.email, role: user.role });

      res.status(201).json({
        success: true,
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Log in user
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
      }

      const token = signToken({ id: user.id, email: user.email, role: user.role });

      res.status(200).json({
        success: true,
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Dispatch 6-digit OTP code cached in Redis
   */
  async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpKey = `otp:${phone}`;

      // Cache in Redis for 5 minutes (300 seconds)
      await redisClient.setEx(otpKey, 300, otp);

      console.log(`📱 [OTP Dispatch] Code sent to ${phone}: ${otp}`);

      res.status(200).json({
        success: true,
        message: 'OTP dispatched successfully. Valid for 5 minutes.',
        // For development/mocking purposes, return OTP in response
        otp: process.env.NODE_ENV !== 'production' ? otp : undefined
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Verify OTP matching Redis key
   */
  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;
      const otpKey = `otp:${phone}`;

      const cachedOtp = await redisClient.get(otpKey);
      if (!cachedOtp || cachedOtp !== otp) {
        return next(new AppError('Invalid or expired OTP code', 400));
      }

      // Delete key from Redis after validation
      await redisClient.del(otpKey);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully.'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Google Login oauth redirect hook
   */
  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { idToken, name, email, profile_image } = req.body;
      // In real scenario, we verify idToken via google-auth-library
      // const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
      // const payload = ticket.getPayload();

      // Find or create user
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Generate placeholder password
        const placeholderPassword = await bcrypt.hash(Math.random().toString(36), 12);
        user = await prisma.user.create({
          data: {
            name,
            email,
            profile_image,
            password: placeholderPassword,
            role: 'USER'
          }
        });
      }

      const token = signToken({ id: user.id, email: user.email, role: user.role });

      res.status(200).json({
        success: true,
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
