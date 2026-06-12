import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateBody, validateEmail } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/signup',
  authLimiter,
  validateBody(['name', 'email', 'password']),
  validateEmail,
  AuthController.signup
);

router.post(
  '/login',
  authLimiter,
  validateBody(['email', 'password']),
  validateEmail,
  AuthController.login
);

router.post(
  '/otp/send',
  validateBody(['phone']),
  AuthController.sendOTP
);

router.post(
  '/otp/verify',
  validateBody(['phone', 'otp']),
  AuthController.verifyOTP
);

router.post(
  '/google-login',
  validateBody(['idToken', 'name', 'email']),
  AuthController.googleLogin
);

export default router;
