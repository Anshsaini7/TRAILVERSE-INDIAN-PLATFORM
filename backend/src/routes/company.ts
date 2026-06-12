import { Router } from 'express';
import { CompanyController } from '../controllers/companyController';
import { protect, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

// Public company catalog routes
router.get('/', CompanyController.getAllCompanies);

// Operator specific protected routes (must be GUIDE role)
router.get('/dashboard', protect, authorize('GUIDE'), CompanyController.getCompanyDashboard);
router.get('/inquiries', protect, authorize('GUIDE'), CompanyController.getInquiries);
router.post(
  '/profile', 
  protect, 
  authorize('GUIDE'), 
  validateBody(['company_name', 'phone', 'address']), 
  CompanyController.createProfile
);
router.post(
  '/verify', 
  protect, 
  authorize('GUIDE'), 
  validateBody(['document_type', 'document_url']), 
  CompanyController.uploadVerificationDocs
);
router.post(
  '/packages', 
  protect, 
  authorize('GUIDE'), 
  validateBody(['trek_id', 'package_price']), 
  CompanyController.addTrekPackage
);

// Wildcard ID lookup route (at bottom to avoid path collisions)
router.get('/:id', CompanyController.getCompanyById);

export default router;
