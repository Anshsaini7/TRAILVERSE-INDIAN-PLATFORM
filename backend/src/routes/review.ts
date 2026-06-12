import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { protect } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Post or update a review (Requires authentication, rate limited)
router.post('/', protect, apiLimiter, ReviewController.createReview);

// Fetch reviews for a specific trek
router.get('/trek/:trekId', ReviewController.getTrekReviews);

export default router;
