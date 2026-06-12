import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const ReviewController = {
  /**
   * Create or update a review for a trek (Authenticated)
   */
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { trek_id, rating, review } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized access credentials', 401));
      }

      if (!trek_id || !rating || !review) {
        return next(new AppError('Trek ID, rating, and review text are required', 400));
      }

      if (rating < 1 || rating > 5) {
        return next(new AppError('Rating must be between 1 and 5', 400));
      }

      // Check if trek exists
      const trek = await prisma.trek.findUnique({
        where: { id: trek_id }
      });

      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      // Upsert review (since unique constraint @@unique([user_id, trek_id]) is set)
      const reviewRecord = await prisma.review.upsert({
        where: {
          user_id_trek_id: {
            user_id: userId,
            trek_id: trek_id
          }
        },
        update: {
          rating: Number(rating),
          review: String(review),
          created_at: new Date()
        },
        create: {
          user_id: userId,
          trek_id: trek_id,
          rating: Number(rating),
          review: String(review)
        },
        include: {
          user: {
            select: {
              name: true,
              profile_image: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: reviewRecord
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get all reviews for a specific trek
   */
  async getTrekReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { trekId } = req.params;

      if (!trekId) {
        return next(new AppError('Trek ID parameter is required', 400));
      }

      const reviews = await prisma.review.findMany({
        where: { trek_id: trekId },
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

      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    } catch (err) {
      next(err);
    }
  }
};
