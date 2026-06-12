import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const AdminController = {
  /**
   * Fetch system metrics and analytics (Admin only)
   */
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Core Counts
      const totalUsers = await prisma.user.count();
      const totalTreks = await prisma.trek.count();
      const totalCompanies = await prisma.company.count();
      const verifiedCompanies = await prisma.company.count({ where: { verification_status: true } });
      const unverifiedCompanies = totalCompanies - verifiedCompanies;

      // 2. Booking stats
      const bookingsCount = await prisma.booking.count();
      const pendingBookings = await prisma.booking.count({ where: { booking_status: 'PENDING' } });
      const confirmedBookings = await prisma.booking.count({ where: { booking_status: 'CONFIRMED' } });
      const cancelledBookings = await prisma.booking.count({ where: { booking_status: 'CANCELLED' } });

      // 3. Compute total booking revenue value (linking bookings to company_treks price)
      const allBookings = await prisma.booking.findMany({
        select: {
          company_id: true,
          trek_id: true,
          payment_status: true
        }
      });

      // Fetch package price mapping
      const companyTreks = await prisma.companyTrek.findMany({
        select: {
          company_id: true,
          trek_id: true,
          package_price: true
        }
      });

      // Build dictionary for lookups
      const priceMap: Record<string, number> = {};
      companyTreks.forEach(ct => {
        priceMap[`${ct.company_id}_${ct.trek_id}`] = ct.package_price;
      });

      let totalValue = 0;
      let paidValue = 0;

      allBookings.forEach(booking => {
        const key = `${booking.company_id}_${booking.trek_id}`;
        const price = priceMap[key] || 0;
        totalValue += price;
        if (booking.payment_status === 'PAID') {
          paidValue += price;
        }
      });

      // 4. Retrieve unverified operators list
      const unverifiedOperators = await prisma.company.findMany({
        where: { verification_status: false },
        orderBy: { company_name: 'asc' }
      });

      res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers
          },
          treks: {
            total: totalTreks
          },
          operators: {
            total: totalCompanies,
            verified: verifiedCompanies,
            unverified: unverifiedCompanies,
            unverifiedList: unverifiedOperators
          },
          bookings: {
            total: bookingsCount,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            cancelled: cancelledBookings,
            totalValue,
            paidRevenue: paidValue
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Toggle operator verification status (Admin only)
   */
  async verifyOperator(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body; // boolean

      if (status === undefined) {
        return next(new AppError('Verification status parameter is required', 400));
      }

      const company = await prisma.company.findUnique({ where: { id } });
      if (!company) {
        return next(new AppError('Operator company not found', 404));
      }

      const updatedCompany = await prisma.company.update({
        where: { id },
        data: { verification_status: Boolean(status) }
      });

      res.status(200).json({
        success: true,
        message: `Operator verification status updated successfully to ${status}`,
        data: updatedCompany
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create a new trek expedition with optional base camps (Admin only)
   */
  async createTrek(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        trek_name,
        state,
        district,
        difficulty,
        altitude,
        distance,
        duration,
        best_season,
        minimum_temperature,
        maximum_temperature,
        oxygen_level,
        route_description,
        trek_images,
        trek_videos,
        baseCamps
      } = req.body;

      if (!trek_name || !state || !district || !difficulty || altitude === undefined || distance === undefined || duration === undefined || !route_description) {
        return next(new AppError('Missing required trek fields.', 400));
      }

      const newTrek = await prisma.$transaction(async (tx) => {
        const trek = await tx.trek.create({
          data: {
            trek_name,
            state,
            district,
            difficulty,
            altitude: Number(altitude),
            distance: Number(distance),
            duration: Number(duration),
            best_season: best_season || 'Autumn & Summer',
            minimum_temperature: minimum_temperature !== undefined ? Number(minimum_temperature) : 0.0,
            maximum_temperature: maximum_temperature !== undefined ? Number(maximum_temperature) : 20.0,
            oxygen_level: oxygen_level || '100% at Base',
            route_description,
            trek_images: trek_images || [],
            trek_videos: trek_videos || []
          }
        });

        if (baseCamps && Array.isArray(baseCamps) && baseCamps.length > 0) {
          for (const camp of baseCamps) {
            await tx.baseCamp.create({
              data: {
                trek_id: trek.id,
                camp_name: camp.camp_name,
                altitude: Number(camp.altitude),
                facilities: camp.facilities || [],
                coordinates: camp.coordinates || { lat: 30.0, lon: 78.0 }
              }
            });
          }
        }

        return trek;
      });

      const createdTrek = await prisma.trek.findUnique({
        where: { id: newTrek.id },
        include: { baseCamps: true }
      });

      res.status(201).json({
        success: true,
        message: 'Trek expedition created successfully',
        data: createdTrek
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete a trek listing (Admin only)
   */
  async deleteTrek(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const trek = await prisma.trek.findUnique({ where: { id } });
      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      await prisma.trek.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Trek listing deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Update a trek listing (Admin only)
   */
  async updateTrek(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const trek = await prisma.trek.findUnique({ where: { id } });
      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      const updatedTrek = await prisma.trek.update({
        where: { id },
        data
      });

      res.status(200).json({
        success: true,
        message: 'Trek details updated successfully',
        data: updatedTrek
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * View all registered Users (Admin only)
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { created_at: 'desc' },
        select: { id: true, name: true, email: true, phone: true, role: true, suspended: true, created_at: true }
      });

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Suspend/Unsuspend User Account (Admin only)
   */
  async suspendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body; // boolean

      if (status === undefined) {
        return next(new AppError('Status parameter (boolean) is required', 400));
      }

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { suspended: Boolean(status) }
      });

      res.status(200).json({
        success: true,
        message: `User account suspension status updated to ${status}`,
        data: { id: updatedUser.id, email: updatedUser.email, suspended: updatedUser.suspended }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete User Account (Admin only)
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      await prisma.user.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'User account deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Fetch company verification documents (Admin only)
   */
  async getCompanyVerificationDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await prisma.verificationDocument.findMany({
        orderBy: { created_at: 'desc' },
        include: {
          company: {
            select: { id: true, company_name: true, email: true, phone: true }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: docs
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Verify/Approve/Reject Operator Documents (Admin only)
   */
  async verifyCompanyDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body; // "APPROVED" or "REJECTED"

      if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        return next(new AppError('Document status (APPROVED or REJECTED) is required', 400));
      }

      const doc = await prisma.verificationDocument.findUnique({ where: { id } });
      if (!doc) {
        return next(new AppError('Verification document not found', 404));
      }

      const updatedDoc = await prisma.verificationDocument.update({
        where: { id },
        data: { status }
      });

      // If approved, automatically toggle the company's verification_status
      if (status === 'APPROVED') {
        await prisma.company.update({
          where: { id: doc.company_id },
          data: { verification_status: true }
        });
      }

      res.status(200).json({
        success: true,
        message: `Company verification document has been ${status}`,
        data: updatedDoc
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete review/moderate comment (Admin only)
   */
  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const review = await prisma.review.findUnique({ where: { id } });
      if (!review) {
        return next(new AppError('Review not found', 404));
      }

      await prisma.review.delete({ where: { id } });

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};
