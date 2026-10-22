const { Router } = require('express');

const { protect } = require('../middlewares/auth.js');

const {createBooking, getMyBookings, cancelBooking} = require('../controllers/BookingController.js');

const bookingRouter = Router();

// Create a new booking
bookingRouter.post('/', protect, createBooking);

// Get bookings for the logged-in user
bookingRouter.get('/my', protect, getMyBookings);

// Cancel an existing booking
bookingRouter.put('/:id/cancel', protect, cancelBooking);

module.exports = bookingRouter;