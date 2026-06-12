import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { protect } from '../middleware/auth';
import { validateBody } from '../middleware/validate';

const router = Router();

// Protect all booking routes
router.use(protect);

router.post('/create', validateBody(['company_id', 'trek_id']), BookingController.createBooking);
router.get('/my-bookings', BookingController.getMyBookings);

export default router;
