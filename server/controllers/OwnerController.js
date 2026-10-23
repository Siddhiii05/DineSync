const Booking = require("../models/Booking");
const Restaurant = require("../models/Restaurant");
const cloudinary = require("cloudinary");

// Helper function to upload the image buffer to Cloudinary and return its secure URL.
const uploadToCloudinary = (fileBuffer, secure_url) => {
    return new Promise((resolve, reject) => {
        // Create a Cloudinary upload stream to upload the image.
        const stream = cloudinary.uploader.upload_stream({folder: "DineSync"}, (error, result) => {
            // Reject the promise if the upload fails.
            if(error) return reject(error);

            if(!result) return reject(new Error("Upload failed"));

            // Return the uploaded image URL.
            resolve({secure_url: result.secure_url})
        })
        stream.end(fileBuffer)
    })
}

// Get owner's restaurant: Find the restaurant registered by the currently logged-in owner.
// GET/api/owner/restaurant
const getOwnerRestaurant = async(req, res) => {
    try{
        const restaurant = await Restaurant.findOne({owner: req.user?._id})
        if(!restaurant){
            return res.status(200).json(null)
        }
        res.json(restaurant)
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server issue"})
    }
}

// Create owner's restaurant (submitted to pending) 
// POST/api/owner/restaurant
const createOwnerRestaurant = async(req, res) => {
    try{
        // Prevent the owner from registering more than one restaurant.
        const existing = await Restaurant.findOne({owner: req.user?._id})

        if(existing){
            return res.status(400).json({message: "You already have a restaurant registered!"})
        }

        // Extract restaurant details submitted through the request body.
        const {name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats} = req.body;

        if(!name || !description || !cuisine || !priceRange || !location || !address || !chef){
            return res.status(400).json({message: "Please provide all required fields!"})
        }

        // Generate a URL-friendly slug from the restaurant name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

        // Check whether another restaurant already uses this slug.
        const slugExists = await Restaurant.findOne({slug});
        if(slugExists){
            return res.status(400).json({message: "A restaurant with this name already exists"})
        }

        // Upload the restaurant image only if a file was provided.
        let imageUrl = ""
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url
        }

        // Convert tags and available time slots into arrays.
        const parsedTags = typeof tags === "string" ? tags.split(",").map((tag) => tag.trim()) : tags || [];
        const parsedSlots = typeof availableSlots || ["17:00", "18:00", "19:00", "20:00", "21:00"];

        // Save the restaurant as pending until an admin approves it.
        const restaurant = await Restaurant.create({
            name,
            slug,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            image: imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20,
            owner: req.user?._id,
            status: 'pending'
        })

        return res.status(201).json(restaurant)
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server issue"})
    }
}

// Update owner's restaurant: Find the restaurant belonging to the logged-in owner.
// PUT/api/owner/restaurant
const updateOwnerRestaurant = async(req, res) => {
    try{
        const restaurant = await Restaurant.findOne({owner: req.user?._id})
        if(!restaurant){
            return res.status(400).json({message: "Restaurant profile not found"})
        }

        // Update only the fields supplied in the request.
        const {name, description, cuisine, priceRange, location, address, chef, tags, availableSlots, totalSeats} = req.body;
        if(name) restaurant.name = name;
        if(description) restaurant.description = description;
        if(cuisine) restaurant.cuisine = cuisine;
        if(priceRange) restaurant.priceRange = priceRange;
        if(location) restaurant.location = location;
        if(address) restaurant.address = address;
        if(chef) restaurant.chef = chef;
        if(totalSeats) restaurant.totalSeats = totalSeats;

        if(tags) {
            restaurant.tags = typeof tags === "string" ? tags.split(",").map((tag) => tag.trim()) : tags;
        }

        if(availableSlots) {
            restaurant.availableSlots = typeof availableSlots === "string" ? availableSlots.split(",").map((slot) => slot.trim()) :  Array.isArray(availableSlots) ? availableSlots : ["17:00", "18:00", "19:00", "20:00", "21:00"];
        }

        // Upload and save a replacement image if a new file is provided.
        if(req.file){
            const result = await uploadToCloudinary(req.file.buffer);
            restaurant.image = result.secure_url
        }

        // Save the updated restaurant details to MongoDB.
        const updated = await restaurant.save();
        return res.json(updated)
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server issue"})
    }
}

// Get bookings for owner's restaurant
// GET/api/owner/bookings
const getOwnerBookings = async(req, res) => {
    try{
        const restaurant = await Restaurant.findOne({owner: req.user?._id})
        if(!restaurant){
            return res.status(400).json({message: "Restaurant profile not found"})
        }
        // Retrieve this restaurant's bookings, include customer details and sort the newest bookings first.
        const bookings = await Booking.find({restaurant: restaurant._id}).populate("user", "name email phone").sort({date: -1, time: -1})
        res.json(bookings)

    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server issue"})
    }
}

// Update booking status
// PUT/api/owner/restaurant
const updateBookingStatus = async(req, res) => {
    try{
        // Read the new booking status from the request body.
        const {status} = req.body;
        if(!status || !["confirmed", "cancelled", "completed"].includes(status)){
            return res.status(400).json({message: "Please enter a valid booking status"})
        }

        // Find the booking using the ID provided in the URL.
        const booking = await Booking.findById(req.params.id)
        if(!booking){
            return res.status(400).json({message: "Booking not found"})
        }

        // Verify that this booking belongs to the logged-in owner's restaurant.    
        const restaurant = await Restaurant.findById(booking.restaurant);
        if(!restaurant || restaurant.owner.toString() !== req.user?._id.toString()){
            return res.status(400).json({message: "Not authorized to manage this booking"})
        }
        
        // Update the status and persist the change in MongoDB
        booking.status = status;
        await booking.save();
        res.json(booking);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Server issue"})
    }
}

module.exports = {uploadToCloudinary, getOwnerRestaurant, createOwnerRestaurant, updateOwnerRestaurant, getOwnerBookings, updateBookingStatus}