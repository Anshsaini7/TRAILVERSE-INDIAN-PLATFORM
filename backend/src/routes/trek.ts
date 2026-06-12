import { Router } from 'express';
import { TrekController } from '../controllers/trekController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', apiLimiter, TrekController.getAllTreks);
router.get('/:id', TrekController.getTrekById);
router.get('/:id/weather', TrekController.syncTrekWeather);
router.get('/:id/elevation', TrekController.getTrekElevationProfile);

export default router;
