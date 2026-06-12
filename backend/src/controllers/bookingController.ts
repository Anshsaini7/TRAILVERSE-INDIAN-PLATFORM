import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const BookingController = {
  /**
   * Create a new booking reservation (Authenticated)
   */
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { company_id, trek_id } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized access credentials', 401));
      }

      // Check if Company Trek Package exists
      const packageRecord = await prisma.companyTrek.findUnique({
        where: {
          company_id_trek_id: { company_id, trek_id }
        }
      });

      if (!packageRecord) {
        return next(new AppError('Requested trek package is not operated by this company.', 404));
      }

      // Create booking record
      const booking = await prisma.booking.create({
        data: {
          user_id: userId,
          company_id,
          trek_id,
          booking_status: 'PENDING',
          payment_status: 'UNPAID'
        },
        include: {
          trek: { select: { trek_name: true } },
          company: { select: { company_name: true } }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Expedition reservation pending. Please proceed to payment.',
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * List all bookings made by the authenticated user
   */
  async getMyBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError('Unauthorized access credentials', 401));
      }

      const bookings = await prisma.booking.findMany({
        where: { user_id: userId },
        include: {
          trek: true,
          company: true
        },
        orderBy: { created_at: 'desc' }
      });

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  }
};
