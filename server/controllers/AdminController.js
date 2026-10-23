const Booking = require("../models/Booking")
const Restaurant = require("../models/Restaurant")
const User = require("../models/User")

//Get all restaurants for admin management
// GET/api/admin/restaurants
const getAllRestaurants = async(req, res) => {
    try{
        const restaurants = await Restaurant.find({}). populate("owner", "name email phone").sort({createdAt: -1})
        res.json(restaurants)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Server issue"})
    }
}

// Approve/reject a restaurant profile
// PUT/api/admin/restaurants/:id/approve
const approveRestaurants = async(req, res) => {
    try{
        const {status} = req.body;
        if(!status || !["approved", "rejected", "pending"].includes(status)){
            return res.status(400).json({message: "Please provide a valid approval status"});
        }
        const restaurant = await Restaurant.findById(req.params.id);
        if(!restaurant){
            return res.status(404).json({message: "Restaurant profile not found"})
        }
        restaurant.status =  status;
        await restaurant.save();

        res.json(restaurant)
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Server issue"})
    }
}

// Get system statistics
// GET/api/admin/stats
const getAdminStats = async(req, res) => {
    try{
        const totalUsers = await User.countDocuments({role: "user"});
        const totalOwners = await User.countDocuments({role: "owner"});
        const totalBookings = await Booking.countDocuments({});
        const totalRestaurants = await Restaurant.countDocuments({});

        // Get latest 10 bookings
        const latestBookings = await Booking.find({}).populate("user", "name email").populate("restaurant", "name".sort({createdAt: -1}.limit(10)));
        res.json({
            users:{
                totalUsers,
                totalOwners,
                total: totalOwners + totalUsers
            },
            restaurants: {
                total: totalRestaurants,
            },
            bookings: {
                total: totalBookings,
            },
            latestBookings
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Server issue"})
    }
}

module.exports = {getAllRestaurants, approveRestaurants, getAdminStats}