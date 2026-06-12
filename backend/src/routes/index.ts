import { Router } from 'express';
import authRouter from './auth';
import trekRouter from './trek';
import companyRouter from './company';
import bookingRouter from './booking';
import aiPlannerRouter from './aiPlanner';
import reviewRouter from './review';
import communityRouter from './community';
import adminRouter from './admin';
import socialRouter from './social';

const router = Router();

router.use('/auth', authRouter);
router.use('/treks', trekRouter);
router.use('/companies', companyRouter);
router.use('/bookings', bookingRouter);
router.use('/ai-planner', aiPlannerRouter);
router.use('/reviews', reviewRouter);
router.use('/community', communityRouter);
router.use('/admin', adminRouter);
router.use('/social', socialRouter);

export default router;
