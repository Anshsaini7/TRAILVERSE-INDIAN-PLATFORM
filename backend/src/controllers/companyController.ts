import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

export const CompanyController = {
  /**
   * List all companies (operators directory)
   */
  async getAllCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await prisma.company.findMany({
        orderBy: { rating: 'desc' }
      });

      res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Fetch single company profile with packages and reviews
   */
  async getCompanyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const company = await prisma.company.findUnique({
        where: { id },
        include: {
          companyTreks: {
            include: {
              trek: {
                select: { trek_name: true, state: true, difficulty: true, altitude: true }
              }
            }
          }
        }
      });

      if (!company) {
        return next(new AppError('Company profile not found', 404));
      }

      res.status(200).json({
        success: true,
        data: company
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Create or update Company Profile (linked via authenticated guide/operator email)
   */
  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;
      const { company_name, logo, website, phone, address } = req.body;

      if (!email) {
        return next(new AppError('Unauthorized', 401));
      }

      let company = await prisma.company.findUnique({ where: { email } });

      if (company) {
        // Update
        company = await prisma.company.update({
          where: { email },
          data: { company_name, logo, website, phone, address }
        });
      } else {
        // Create
        company = await prisma.company.create({
          data: {
            company_name,
            logo,
            website,
            phone,
            email,
            address,
            verification_status: false // Default false, requires admin approval
          }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Company profile saved successfully',
        data: company
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Upload Verification Documents (GST, License, ID)
   */
  async uploadVerificationDocs(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;
      const { document_type, document_url } = req.body;

      if (!email) {
        return next(new AppError('Unauthorized', 401));
      }

      const company = await prisma.company.findUnique({ where: { email } });
      if (!company) {
        return next(new AppError('Company profile not created yet. Please create profile first.', 400));
      }

      const doc = await prisma.verificationDocument.create({
        data: {
          company_id: company.id,
          document_type,
          document_url,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Verification document submitted successfully. Awaiting Admin review.',
        data: doc
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Add a Trek Package
   */
  async addTrekPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;
      const { trek_id, package_price, package_details } = req.body;

      if (!email) {
        return next(new AppError('Unauthorized', 401));
      }

      const company = await prisma.company.findUnique({ where: { email } });
      if (!company) {
        return next(new AppError('Company profile not found', 404));
      }

      // Check if trek exists
      const trek = await prisma.trek.findUnique({ where: { id: trek_id } });
      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      const companyTrek = await prisma.companyTrek.create({
        data: {
          company_id: company.id,
          trek_id,
          package_price: Number(package_price),
          package_details: package_details || {}
        }
      });

      res.status(201).json({
        success: true,
        message: 'Trek package added successfully',
        data: companyTrek
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get Operator Dashboard statistics
   */
  async getCompanyDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;
      if (!email) {
        return next(new AppError('Unauthorized', 401));
      }

      const company = await prisma.company.findUnique({ where: { email } });
      if (!company) {
        return next(new AppError('Company profile not found', 404));
      }

      // 1. Total Packages
      const packageCount = await prisma.companyTrek.count({
        where: { company_id: company.id }
      });

      // 2. Bookings stats (Leads)
      const totalBookings = await prisma.booking.count({
        where: { company_id: company.id }
      });
      const pendingBookings = await prisma.booking.count({
        where: { company_id: company.id, booking_status: 'PENDING' }
      });
      const confirmedBookings = await prisma.booking.count({
        where: { company_id: company.id, booking_status: 'CONFIRMED' }
      });

      // 3. Compute estimated Revenue (Sum of package price for confirmed/paid bookings)
      const bookingsList = await prisma.booking.findMany({
        where: { company_id: company.id, booking_status: 'CONFIRMED' },
        select: { trek_id: true }
      });

      const packages = await prisma.companyTrek.findMany({
        where: { company_id: company.id },
        select: { trek_id: true, package_price: true }
      });

      const priceMap: Record<string, number> = {};
      packages.forEach(p => {
        priceMap[p.trek_id] = p.package_price;
      });

      let totalRevenue = 0;
      bookingsList.forEach(b => {
        totalRevenue += priceMap[b.trek_id] || 0;
      });

      res.status(200).json({
        success: true,
        data: {
          company_id: company.id,
          company_name: company.company_name,
          verification_status: company.verification_status,
          rating: company.rating,
          totalPackages: packageCount,
          totalLeads: totalBookings,
          pendingLeads: pendingBookings,
          confirmedLeads: confirmedBookings,
          estimatedRevenue: totalRevenue
        }
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get leads/inquiries list
   */
  async getInquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.user?.email;
      if (!email) {
        return next(new AppError('Unauthorized', 401));
      }

      const company = await prisma.company.findUnique({ where: { email } });
      if (!company) {
        return next(new AppError('Company profile not found', 404));
      }

      const bookings = await prisma.booking.findMany({
        where: { company_id: company.id },
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          },
          trek: {
            select: { id: true, trek_name: true }
          }
        }
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
