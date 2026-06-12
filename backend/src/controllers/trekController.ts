import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middleware/error';
import { MapService } from '../services/mapService';
import { getTrekWeather } from '../services/weatherService';

export const TrekController = {
  /**
   * List all treks with queries (search, state, difficulty, budget/price bounds)
   */
  async getAllTreks(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, state, difficulty, max_altitude, max_duration } = req.query;

      const whereClause: any = {};

      if (search) {
        whereClause.trek_name = { contains: String(search), mode: 'insensitive' };
      }
      if (state) {
        whereClause.state = String(state);
      }
      if (difficulty) {
        whereClause.difficulty = String(difficulty);
      }
      if (max_altitude) {
        whereClause.altitude = { lte: Number(max_altitude) };
      }
      if (max_duration) {
        whereClause.duration = { lte: Number(max_duration) };
      }

      const treks = await prisma.trek.findMany({
        where: whereClause,
        include: {
          baseCamps: { select: { camp_name: true } }
        }
      });

      res.status(200).json({
        success: true,
        count: treks.length,
        data: treks
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Fetch a single trek with base camps, weather, and packages
   */
  async getTrekById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const trek = await prisma.trek.findUnique({
        where: { id },
        include: {
          baseCamps: true,
          weather: true,
          companyTreks: {
            include: {
              company: {
                select: { company_name: true, logo: true, rating: true }
              }
            }
          }
        }
      });

      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      res.status(200).json({
        success: true,
        data: trek
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Fetch live weather and synchronize it into PostgreSQL
   */
  async syncTrekWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const trek = await prisma.trek.findUnique({ where: { id } });
      if (!trek) {
        return next(new AppError('Trek not found', 404));
      }

      // Read coordinate details from first base camp or use state defaults
      const firstCamp = await prisma.baseCamp.findFirst({ where: { trek_id: id } });
      const coords = firstCamp 
        ? (firstCamp.coordinates as any) 
        : { lat: 30.0, lon: 78.0 }; // Default Uttarakhand coordinates

      // Call live weather service
      const freshWeather = await getTrekWeather(id, coords.lat, coords.lon);

      // Save/Upsert inside PostgreSQL database
      const weatherRecord = await prisma.weather.upsert({
        where: { trek_id: id },
        update: {
          temperature: freshWeather.temperature,
          humidity: freshWeather.humidity,
          weather_condition: freshWeather.weather_condition
        },
        create: {
          trek_id: id,
          temperature: freshWeather.temperature,
          humidity: freshWeather.humidity,
          weather_condition: freshWeather.weather_condition
        }
      });

      res.status(200).json({
        success: true,
        data: weatherRecord
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Compute elevation profile via Mapbox API
   */
  async getTrekElevationProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const baseCamps = await prisma.baseCamp.findMany({
        where: { trek_id: id },
        orderBy: { altitude: 'asc' }
      });

      if (baseCamps.length === 0) {
        return next(new AppError('No base camps coordinates found for this trek profile.', 400));
      }

      const coords = baseCamps.map(bc => {
        const cObj = bc.coordinates as any;
        return { lat: cObj.lat || 30.0, lon: cObj.lon || 78.0 };
      });

      const profile = await MapService.getElevationProfile(coords);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  }
};
