import { Router } from 'express';
import { SocialController } from '../controllers/socialController';
import { protect } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

// Feed and stories are accessible by authenticated users
router.get('/feed', protect, SocialController.getFeed);
router.get('/stories', protect, SocialController.getStories);

// User connection actions
router.post('/follow/:id', protect, SocialController.followUser);
router.delete('/unfollow/:id', protect, SocialController.unfollowUser);
router.get('/followers/:id', SocialController.getFollowers);
router.get('/following/:id', SocialController.getFollowing);

// Post creation & reactions
router.post('/posts', protect, validateBody(['content']), SocialController.createPost);
router.post('/posts/:id/like', protect, SocialController.likePost);
router.delete('/posts/:id/unlike', protect, SocialController.unlikePost);
router.post('/posts/:id/comment', protect, validateBody(['content']), SocialController.commentPost);

// Stories upload
router.post('/stories', protect, validateBody(['mediaUrl']), SocialController.createStory);

export default router;
