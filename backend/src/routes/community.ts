import { Router } from 'express';
import { CommunityController } from '../controllers/communityController';
import { protect } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Create a post or buddy request pool
router.post('/posts', protect, apiLimiter, CommunityController.createPost);

// Retrieve posts or buddy requests
router.get('/posts', CommunityController.getPosts);

// Join a buddy request group pool
router.post('/buddy/join/:id', protect, CommunityController.joinBuddyGroup);

// Get global community leaderboard
router.get('/leaderboard', CommunityController.getLeaderboard);

export default router;
