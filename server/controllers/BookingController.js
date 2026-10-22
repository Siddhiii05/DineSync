const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');

// create new booking
// POST/api/booking
// @access private
const createBooking = async (req, res) => {
    try{
        const {restaurantId, date, time, guests, occasion, specialRequests} = req.body;

        // Check required fields
        if(!restaurantId || !date || !time || !guests){
            return res.status(400).json({message: "Please enter all required fields!"})
        }

        // Validate number of guests
        const requestedGuests = Number(guests);

        if (!Number.isInteger(requestedGuests) || requestedGuests < 1) {
            return res.status(400).json({
                message: 'Guests must be a positive whole number.'
            });
        }

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if(!restaurant){
            return res.status(400).json({message: "Restaurant not found!"})
        }

        // Verify restaurant is approved
        if(restaurant.status !== "approved"){
            return res.status(400).json({message: "Reservations are not open for this restaurant yet!"})
        }

        // Verify seat availability
        const bookingDate = new Date(date);
        if (Number.isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                message: 'Please provide a valid booking date.'
            });
        }

        // Check seat availability for the selected date and time
        const existingBookings = await Booking.find({
            restaurant: restaurantId,
            date: bookingDate,
            time,
            status: "confirmed"
        })

        const bookedSeats = existingBookings.reduce((sum, booking) => sum + booking.guests, 0);

        const totalSeats = restaurant.totalSeats || 20;
        const availableSeats = totalSeats - bookedSeats;

        if(requestedGuests > availableSeats){
            return res.status(400).json({message: `Unable to reserve. Only ${availableSeats} seats are available for this time slot`})
        }

        // Create the booking
        const booking = await Booking.create({
            user: req.user?._id,
            restaurant: restaurantId,
            date: bookingDate,
            time,
            guests: Number(guests),
            occasion,
            specialRequests,
            status: 'confirmed'
        })

        // Populate restaurant info before returning
        const populatedBooking = await booking.populate("restaurant", "name location image address")
        return res.status(201).json(populatedBooking)
        
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error while creating booking.'})
    }
}

// Get logged-in user bookings
// GET/api/booking/my
// @access private
const getMyBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({user: req.user?._id}).populate('restaurant', "name location image address slug").sort({date: -1, time: -1});
        return res.status(200).json(bookings);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error while creating booking.'})
    }
}

// Cancel a booking
// PUT/api/booking/:id/cancel
// @access private
const cancelBooking = async (req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({message: "Booking not found"}) 
        }

        // Verify that the logged-in user owns this booking
        if(booking.user.toString() !== req.user?._id.toString()){
            return res.status(404).json({message: "Not authorized to cancel this booking"}) 
        }

        // Prevent cancelling an already cancelled booking
        if (booking.status === 'cancelled') {
            return res.status(400).json({message: 'This booking has already been cancelled.'});
        }

        booking.status = "cancelled";
        await booking.save();

        const populatedBooking = await booking.populate("restaurant", "name location image address")
        return res.status(200).json(populatedBooking);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error while creating booking.'})
    }
}

module.exports = {createBooking, getMyBookings, cancelBooking}