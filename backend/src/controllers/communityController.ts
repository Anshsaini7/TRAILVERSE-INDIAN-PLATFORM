import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const CommunityController = {
  /**
   * Create a community post or buddy request (Authenticated)
   */
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { content, images, isBuddy, trek_id, start_date, group_size, gender_pref, title, category } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized access credentials', 401));
      }

      if (!content) {
        return next(new AppError('Content text is required', 400));
      }

      let formattedContent = content;

      if (isBuddy) {
        if (!trek_id || !start_date || !group_size || !gender_pref) {
          return next(new AppError('For buddy requests: trek_id, start_date, group_size, and gender_pref are required', 400));
        }

        // Verify trek exists
        const trek = await prisma.trek.findUnique({ where: { id: trek_id } });
        if (!trek) {
          return next(new AppError('Selected trek does not exist', 404));
        }

        // Store serialized metadata in content field
        formattedContent = JSON.stringify({
          isBuddy: true,
          trek_id,
          trek_name: trek.trek_name,
          start_date,
          group_size: Number(group_size),
          gender_pref,
          joined_users: [userId], // Creator is the first buddy
          description: content
        });
      } else {
        // Regular forum post
        formattedContent = JSON.stringify({
          isBuddy: false,
          title: title || 'Untitled Thread',
          category: category || 'General Discussion',
          description: content,
          likes: 0,
          replies: 0
        });
      }

      const post = await prisma.communityPost.create({
        data: {
          user_id: userId,
          content: formattedContent,
          images: images || []
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile_image: true
            }
          }
        }
      });

      // Format response
      let responseData: any = { ...post };
      try {
        const parsed = JSON.parse(post.content);
        responseData = { ...post, ...parsed };
      } catch (e) {
        // Fallback if content was not JSON
      }

      res.status(201).json({
        success: true,
        message: isBuddy ? 'Trek buddy pool created successfully' : 'Forum thread published successfully',
        data: responseData
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get all community posts (forums or buddy requests) with type filtering
   */
  async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, search } = req.query; // 'buddy' or 'forum'

      const posts = await prisma.communityPost.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile_image: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const formattedPosts = posts.map(post => {
        let details: any = { isBuddy: false, description: post.content };
        try {
          details = JSON.parse(post.content);
        } catch (e) {
          // If not JSON, it is a plain text post
        }
        return {
          id: post.id,
          user_id: post.user_id,
          images: post.images,
          created_at: post.created_at,
          user: post.user,
          ...details
        };
      });

      // Filter by type
      let filtered = formattedPosts;
      if (type === 'buddy') {
        filtered = formattedPosts.filter(p => p.isBuddy === true);
      } else if (type === 'forum') {
        filtered = formattedPosts.filter(p => p.isBuddy === false);
      }

      // Filter by search query
      if (search) {
        const query = String(search).toLowerCase();
        filtered = filtered.filter(p => 
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.trek_name && p.trek_name.toLowerCase().includes(query))
        );
      }

      res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Request to join a buddy group pool (Authenticated)
   */
  async joinBuddyGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized access credentials', 401));
      }

      const post = await prisma.communityPost.findUnique({
        where: { id }
      });

      if (!post) {
        return next(new AppError('Buddy request pool not found', 404));
      }

      let details: any;
      try {
        details = JSON.parse(post.content);
      } catch (e) {
        return next(new AppError('This post is not a valid buddy request pool', 400));
      }

      if (!details.isBuddy) {
        return next(new AppError('This post is not a buddy request pool', 400));
      }

      // Check if user has already joined
      if (details.joined_users && details.joined_users.includes(userId)) {
        return next(new AppError('You have already joined this buddy group', 400));
      }

      // Check if group is full
      if (details.joined_users && details.joined_users.length >= details.group_size) {
        return next(new AppError('This adventure buddy group is already full', 400));
      }

      // Add user to buddy list
      const updatedJoined = [...(details.joined_users || []), userId];
      details.joined_users = updatedJoined;

      const updatedPost = await prisma.communityPost.update({
        where: { id },
        data: {
          content: JSON.stringify(details)
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile_image: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Successfully requested to join buddy group',
        data: {
          id: updatedPost.id,
          user_id: updatedPost.user_id,
          images: updatedPost.images,
          created_at: updatedPost.created_at,
          user: updatedPost.user,
          ...details
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Leaderboard summary (Total treks completed, points)
   */
  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      // We will aggregate bookings per user with CONFIRMED status to represent completed treks.
      // And we will assign points based on total altitude gained or treks completed.
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          profile_image: true,
          bookings: {
            where: {
              booking_status: 'CONFIRMED'
            },
            include: {
              trek: {
                select: {
                  altitude: true
                }
              }
            }
          }
        }
      });

      // Calculate ranks and altitude gained
      const leaderboard = users.map(user => {
        const completedTreks = user.bookings.length;
        const altitudeGained = user.bookings.reduce((sum, b) => sum + (b.trek?.altitude || 0), 0);
        const points = completedTreks * 1000 + Math.round(altitudeGained * 0.1);
        
        let badge = 'Explorer';
        if (points >= 8000) badge = 'Himalayan Sherpa';
        else if (points >= 5000) badge = 'Peak Conqueror';
        else if (points >= 3000) badge = 'Cloud Walker';
        else if (points >= 1500) badge = 'Trail Blazer';

        return {
          id: user.id,
          name: user.name,
          avatar: user.profile_image || '🧗',
          altitudeGained,
          completedTreks,
          points,
          badge
        };
      });

      // Sort by points descending
      leaderboard.sort((a, b) => b.points - a.points);

      // Add rank numbers
      const rankedLeaderboard = leaderboard.map((u, i) => ({
        rank: i + 1,
        ...u
      }));

      res.status(200).json({
        success: true,
        data: rankedLeaderboard
      });
    } catch (err) {
      next(err);
    }
  }
};
