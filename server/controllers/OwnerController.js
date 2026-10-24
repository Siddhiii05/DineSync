const Booking = require("../models/Booking");
const Restaurant = require("../models/Restaurant");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "DineSync",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

// GET /api/owner/restaurant
// Get the restaurant belonging to the logged-in owner.
const getOwnerRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            return res.status(200).json(null);
        }

        return res.json(restaurant);
    } catch (error) {
        console.error("GET OWNER RESTAURANT ERROR:", error);
        return res.status(500).json({
            message: "Server issue",
        });
    }
};

// POST /api/owner/restaurant
// Register a restaurant and submit it for admin approval.
const createOwnerRestaurant = async (req, res) => {
    try {
        console.log("Request content type:", req.headers["content-type"]);
        console.log("Uploaded file:", req.file);
        console.log("Request body:", req.body);

        // Check authentication.
        if (!req.user?._id) {
            return res.status(401).json({
                message: "Authentication required.",
            });
        }

        // Allow only one restaurant per owner.
        const existing = await Restaurant.findOne({
            owner: req.user._id,
        });

        if (existing) {
            return res.status(400).json({
                message: "You already have a restaurant registered!",
            });
        }

        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
        } = req.body;

        // Validate required fields.
        if (
            !name?.trim() ||
            !description?.trim() ||
            !cuisine ||
            !priceRange ||
            !location?.trim() ||
            !address?.trim() ||
            !chef?.trim()
        ) {
            return res.status(400).json({
                message: "Please provide all required fields!",
            });
        }

        // Validate the uploaded image.
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a restaurant image.",
            });
        }

        // Generate a URL-friendly slug.
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        if (!slug) {
            return res.status(400).json({
                message: "Please provide a valid restaurant name.",
            });
        }

        // Prevent duplicate restaurant slugs.
        const slugExists = await Restaurant.findOne({ slug });

        if (slugExists) {
            return res.status(400).json({
                message: "A restaurant with this name already exists.",
            });
        }

        const uploadResult = await uploadToCloudinary(req.file.buffer);
        const imageUrl = uploadResult.secure_url;

        // Convert tags into an array.
        const parsedTags = Array.isArray(tags)
            ? tags
            : (tags || "")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean);

        // Convert available slots into an array.
        const parsedSlots = Array.isArray(availableSlots)
            ? availableSlots
            : typeof availableSlots === "string" && availableSlots.trim()
                ? availableSlots
                    .split(",")
                    .map((slot) => slot.trim())
                    .filter(Boolean)
                : ["17:00", "18:00", "19:00", "20:00", "21:00"];

        // Create the restaurant.
        const restaurant = await Restaurant.create({
            name: name.trim(),
            slug,
            description: description.trim(),
            cuisine,
            priceRange,
            location: location.trim(),
            address: address.trim(),
            chef: chef.trim(),
            image: imageUrl,
            tags: parsedTags,
            availableSlots: parsedSlots,
            totalSeats: totalSeats ? Number(totalSeats) : 20,
            owner: req.user._id,
            status: "pending",
        });

        console.log("Restaurant saved successfully:", restaurant._id);

        return res.status(201).json({
            success: true,
            message: "Restaurant submitted for admin approval.",
            restaurant,
        });
    } catch (error) {
        console.error("CREATE RESTAURANT ERROR:", error);

        return res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
};

// PUT /api/owner/restaurant
// Update the logged-in owner's restaurant.
const updateOwnerRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant profile not found.",
            });
        }

        const {
            name,
            description,
            cuisine,
            priceRange,
            location,
            address,
            chef,
            tags,
            availableSlots,
            totalSeats,
        } = req.body;

        if (name !== undefined) restaurant.name = name.trim();
        if (description !== undefined) restaurant.description = description.trim();
        if (cuisine !== undefined) restaurant.cuisine = cuisine;
        if (priceRange !== undefined) restaurant.priceRange = priceRange;
        if (location !== undefined) restaurant.location = location.trim();
        if (address !== undefined) restaurant.address = address.trim();
        if (chef !== undefined) restaurant.chef = chef.trim();

        if (totalSeats !== undefined && totalSeats !== "") {
            const seats = Number(totalSeats);

            if (!Number.isFinite(seats) || seats < 1) {
                return res.status(400).json({
                    message: "Total seats must be a positive number.",
                });
            }

            restaurant.totalSeats = seats;
        }

        if (tags !== undefined) {
            restaurant.tags = Array.isArray(tags)
                ? tags
                : tags.split(",").map((tag) => tag.trim()).filter(Boolean);
        }

        if (availableSlots !== undefined) {
            restaurant.availableSlots = Array.isArray(availableSlots)
                ? availableSlots
                : availableSlots
                    .split(",")
                    .map((slot) => slot.trim())
                    .filter(Boolean);
        }

         if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.buffer);
            restaurant.image = uploadResult.secure_url;
        }

        const updatedRestaurant = await restaurant.save();

        return res.json({
            success: true,
            message: "Restaurant profile updated successfully.",
            restaurant: updatedRestaurant,
        });
    } catch (error) {
        console.error("UPDATE OWNER RESTAURANT ERROR:", error);

        return res.status(500).json({
            message: error.message || "Server issue",
        });
    }
};

// GET /api/owner/bookings
// Get bookings for the owner's restaurant.
const getOwnerBookings = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            owner: req.user?._id,
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant profile not found.",
            });
        }

        const bookings = await Booking.find({
            restaurant: restaurant._id,
        })
            .populate("user", "name email phone")
            .sort({ date: -1, time: -1 });

        return res.json(bookings);
    } catch (error) {
        console.error("GET OWNER BOOKINGS ERROR:", error);

        return res.status(500).json({
            message: "Server issue",
        });
    }
};

// PUT /api/owner/bookings/:id/status
// Update the status of a booking belonging to the owner's restaurant.
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (
            !status ||
            !["confirmed", "cancelled", "completed"].includes(status)
        ) {
            return res.status(400).json({
                message: "Please enter a valid booking status.",
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found.",
            });
        }

        const restaurant = await Restaurant.findById(booking.restaurant);

        if (
            !restaurant ||
            restaurant.owner.toString() !== req.user?._id?.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to manage this booking.",
            });
        }

        booking.status = status;
        await booking.save();

        return res.json({
            success: true,
            message: "Booking status updated successfully.",
            booking,
        });
    } catch (error) {
        console.error("UPDATE BOOKING STATUS ERROR:", error);

        return res.status(500).json({
            message: "Server issue",
        });
    }
};

// GET /api/owner/restaurants
// Fetch all restaurants belonging to the logged-in owner.
const getOwnerRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            owner: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json(restaurants);
    } catch (error) {
        console.error("GET OWNER RESTAURANTS ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch owner restaurants.",
        });
    }
};

// GET /api/owner/restaurants/:id
// Fetch one restaurant belonging to the logged-in owner.
const getOwnerRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!restaurant) {
            return res.status(404).json({
                message: "Restaurant not found.",
            });
        }

        return res.status(200).json(restaurant);
    } catch (error) {
        console.error("GET OWNER RESTAURANT BY ID ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch restaurant.",
        });
    }
};


module.exports = {
    uploadToCloudinary,
    getOwnerRestaurant,
    createOwnerRestaurant,
    updateOwnerRestaurant,
    getOwnerBookings,
    updateBookingStatus,
    getOwnerRestaurantById,
    getOwnerRestaurants
};
