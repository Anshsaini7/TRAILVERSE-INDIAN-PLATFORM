import { Router } from 'express';
import { AiPlannerController } from '../controllers/aiPlannerController';
import { validateBody } from '../middleware/validate';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/generate',
  apiLimiter,
  validateBody(['budget', 'days', 'fitness', 'groupSize', 'state', 'adventureType']),
  AiPlannerController.generatePlan
);

export default router;
