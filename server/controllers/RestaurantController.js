const Booking = require('../models/Booking');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get all restaurants with search and filters

const Restaurant = require("../models/Restaurant");

// GET/api/restaurants
const getRestaurant = async(req, res) => {
    try{
        const {search, priceRange, rating, location, sort} = req.query;

        //Build query object
        const queryObj = {status: 'approved'};

        if(search){
            queryObj.$or = [
                {name: {$regex: search, $options:'i'}},
                {tags: {$regex: search, $options:'i'}},
                {location: {$regex: search, $options:'i'}},
            ]
        }

        if(priceRange){
            const prices = Array.isArray(priceRange) ? priceRange : [priceRange];
            queryObj.priceRange = {$in: prices};
        }

        if (rating) {
            queryObj.rating = { $gte: parseFloat(rating) };
        }

        if (location) {
            queryObj.location = {
                $regex: location,
                $options: 'i'
            };
        }

        //  
        let sortOption = { createdAt: -1 };

        if (sort === 'rating') {
            sortOption = { rating: -1 };
        } else if (sort === 'price_low') {
            sortOption = { priceRange: 1 };
        } else if (sort === 'price_high') {
            sortOption = { priceRange: -1 };
        }

        const restaurants = await Restaurant.find(queryObj).sort(sortOption);

        return res.json(restaurants);
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Server issue'})
    }
}

// Get featured and exclusive restaurants
// GET/api/restaurants/featured
const getFeaturedRestaurant = async(req, res) => {
    try{
        const featured = await Restaurant.find({
            status: "approved",
            $or: [{featured: true}, {exclusive: true}]
        }).limit(6)
        res.json(featured)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Server issue'})
    }
}

// Get single restaurant by slug
// GET/api/restaurants/:slug
const getRestaurantBySlug = async(req, res) => {
    try{
        const restaurant = await Restaurant.findOne({slug: req.params.slug})
        if(!restaurant){
            return res.status(400).json({message: "Restaurant not found"})
        }

        // If not approved, verify authorization
        if(restaurant.status !== "approved"){
            let isAuthorized = false;
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                try{
                    // Get token from header
                    const token = req.headers.authorization.split(' ')[1];
                    
                    //Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);

                    const user = await User.findById(decoded.id);
                    if(user && (user.role === "admin" || (user.role === "owner" && restaurant.owner.toString() === user.id.toString()))){
                        isAuthorized = true
                    }
                }
                catch(err){}
            }
            if(!isAuthorized){
                return res.status(400).json({message: "Restaurant not found or pending approval"})
            }
        }
        res.json(restaurant)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Server issue'})
    }
}

// Get dynamic seat availability for slots
// GET/api/restaurants/:id/availability
const getRestaurantAvailability = async(req, res) => {
    try{
        const {date} = req.query;
        if(!date){
            return res.status(400).json({message: "Provide a date"})
        }

        // Validate date
        const bookingDate = new Date(date);

        if (Number.isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                message: 'Please provide a valid date.'
            });
        }

        // Find restaurant
        const restaurant = await Restaurant.findById(req.params.id);
        if(!restaurant){
            return res.status(400).json({message: "Restaurant not found"})
        }

        if (restaurant.status !== 'approved') {
            return res.status(400).json({message: 'This restaurant is not accepting reservations.'});
        }

        // Find confirmed bookings for the selected date
        // Assumes booking dates are stored at midnight UTC.
        const startOfDay = new Date(`${date}T00:00:00.000Z`);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

        //Get all active booking on this date for the restaurant 
        const bookings = await Booking.find({
            restaurant: restaurant._id,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            status: "confirmed",
        })

        // Calculate availability for each time slot
        const availability = restaurant.availableSlots.map((slot) => {
            const bookedSeats = bookings.filter((booking) => booking.time === slot).reduce((sum, booking) => sum + booking.guests, 0);

            const totalSeats = restaurant.totalSeats || 20;
            const availableSeats = Math.max(0, totalSeats - bookedSeats);

            return{
                time: slot,
                availableSeats,
                isAvailable: availableSeats > 0
            }
        })
        return res.status(200).json(availability);
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: 'Server error while checking availability'})
    }
}

module.exports = {getRestaurant, getFeaturedRestaurant, getRestaurantBySlug, getRestaurantAvailability};