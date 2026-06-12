import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const SocialController = {
  /**
   * Follow a user
   */
  async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = req.user?.id;
      const followingId = req.params.id;

      if (!followerId) {
        return next(new AppError('Unauthorized', 401));
      }

      if (followerId === followingId) {
        return next(new AppError('You cannot follow yourself', 400));
      }

      // Check target user exists
      const targetUser = await prisma.user.findUnique({ where: { id: followingId } });
      if (!targetUser) {
        return next(new AppError('User not found', 444));
      }

      // Check if already following
      const existing = await prisma.follower.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId
          }
        }
      });

      if (existing) {
        return next(new AppError('Already following this user', 400));
      }

      const connection = await prisma.follower.create({
        data: {
          follower_id: followerId,
          following_id: followingId
        }
      });

      // Create a notification
      await prisma.notification.create({
        data: {
          user_id: followingId,
          title: 'New Follower',
          content: `${req.user?.email} has started following you.`
        }
      });

      res.status(201).json({
        success: true,
        message: 'Successfully followed user',
        data: connection
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const followerId = req.user?.id;
      const followingId = req.params.id;

      if (!followerId) {
        return next(new AppError('Unauthorized', 401));
      }

      // Check if follow connection exists
      const existing = await prisma.follower.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId
          }
        }
      });

      if (!existing) {
        return next(new AppError('Not following this user', 400));
      }

      await prisma.follower.delete({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Successfully unfollowed user'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get list of followers
   */
  async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const followers = await prisma.follower.findMany({
        where: { following_id: userId },
        include: {
          follower: {
            select: { id: true, name: true, email: true, profile_image: true, username: true }
          }
        }
      });

      res.status(200).json({
        success: true,
        count: followers.length,
        data: followers.map(f => f.follower)
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get list of users a user is following
   */
  async getFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const following = await prisma.follower.findMany({
        where: { follower_id: userId },
        include: {
          following: {
            select: { id: true, name: true, email: true, profile_image: true, username: true }
          }
        }
      });

      res.status(200).json({
        success: true,
        count: following.length,
        data: following.map(f => f.following)
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create a post
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { content, images } = req.body;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      const post = await prisma.communityPost.create({
        data: {
          user_id: userId,
          content,
          images: images || []
        },
        include: {
          user: {
            select: { id: true, name: true, username: true, profile_image: true }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Community Feed
   */
  async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await prisma.communityPost.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, username: true, profile_image: true }
          },
          likes: true,
          comments: {
            include: {
              user: {
                select: { id: true, name: true, username: true, profile_image: true }
              }
            },
            orderBy: { created_at: 'asc' }
          }
        }
      });

      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Like a post
   */
  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const postId = req.params.id;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      // Check if post exists
      const post = await prisma.communityPost.findUnique({ where: { id: postId } });
      if (!post) {
        return next(new AppError('Post not found', 404));
      }

      // Check if already liked
      const existing = await prisma.postLike.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId
          }
        }
      });

      if (existing) {
        return next(new AppError('Post already liked', 400));
      }

      const like = await prisma.postLike.create({
        data: {
          user_id: userId,
          post_id: postId
        }
      });

      // Send notification if someone else likes your post
      if (post.user_id !== userId) {
        await prisma.notification.create({
          data: {
            user_id: post.user_id,
            title: 'New Like',
            content: `${req.user?.email} liked your post.`
          }
        });
      }

      res.status(201).json({
        success: true,
        data: like
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Unlike a post
   */
  async unlikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const postId = req.params.id;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      const existing = await prisma.postLike.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId
          }
        }
      });

      if (!existing) {
        return next(new AppError('Post not liked yet', 400));
      }

      await prisma.postLike.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Post unliked successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Comment on a post
   */
  async commentPost(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const postId = req.params.id;
      const { content } = req.body;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      if (!content || !content.trim()) {
        return next(new AppError('Comment content is required', 400));
      }

      const post = await prisma.communityPost.findUnique({ where: { id: postId } });
      if (!post) {
        return next(new AppError('Post not found', 404));
      }

      const comment = await prisma.postComment.create({
        data: {
          user_id: userId,
          post_id: postId,
          content: content.trim()
        },
        include: {
          user: {
            select: { id: true, name: true, username: true, profile_image: true }
          }
        }
      });

      // Send notification if someone else comments
      if (post.user_id !== userId) {
        await prisma.notification.create({
          data: {
            user_id: post.user_id,
            title: 'New Comment',
            content: `${req.user?.email} commented on your post: "${content.substring(0, 20)}..."`
          }
        });
      }

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create a Story
   */
  async createStory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { mediaUrl } = req.body;

      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      // Story expires in 24 hours
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const story = await prisma.story.create({
        data: {
          user_id: userId,
          media_url: mediaUrl,
          expires_at: expiresAt
        },
        include: {
          user: {
            select: { id: true, name: true, username: true, profile_image: true }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: story
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Active Stories (non-expired)
   */
  async getStories(req: Request, res: Response, next: NextFunction) {
    try {
      const activeStories = await prisma.story.findMany({
        where: {
          expires_at: {
            gt: new Date()
          }
        },
        include: {
          user: {
            select: { id: true, name: true, username: true, profile_image: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      res.status(200).json({
        success: true,
        count: activeStories.length,
        data: activeStories
      });
    } catch (err) {
      next(err);
    }
  }
};
