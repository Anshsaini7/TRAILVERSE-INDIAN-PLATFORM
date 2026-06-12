import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Secure all admin routes with protect & authorize('ADMIN')
router.use(protect);
router.use(authorize('ADMIN'));

// Get analytics overview
router.get('/analytics', apiLimiter, AdminController.getAnalytics);

// Verify operator / company status directly
router.patch('/verify-operator/:id', AdminController.verifyOperator);

// Trek Management
router.post('/treks/create', AdminController.createTrek);
router.put('/treks/:id', AdminController.updateTrek);
router.delete('/treks/:id', AdminController.deleteTrek);

// User Management
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/suspend', AdminController.suspendUser);
router.delete('/users/:id', AdminController.deleteUser);

// Company verification documents management
router.get('/companies/verify', AdminController.getCompanyVerificationDocs);
router.patch('/companies/verify/:id', AdminController.verifyCompanyDocument);

// Review moderation
router.delete('/reviews/:id', AdminController.deleteReview);

export default router;
