const upload = require("../config/multer");
const { Router } = require('express');
const { protect, ownerOnly } = require("../middlewares/auth.js");
const { getOwnerRestaurant, createOwnerRestaurant, updateOwnerRestaurant, getOwnerBookings, updateBookingStatus } = require("../controllers/OwnerController");

const ownerRouter = Router();

// Apply authentication middleware to all routes below.
// protect verifies that the user is logged in.
ownerRouter.use(protect);

// ownerOnly ensures that only users with the owner role can access these routes.
ownerRouter.use(ownerOnly);

// Retrieve the logged-in owner's restaurant details.
ownerRouter.get("/restaurant", getOwnerRestaurant);

// Register a new restaurant.
// upload.single("image") handles a single uploaded image from the request.
ownerRouter.post("/restaurant",upload.single("image"),createOwnerRestaurant);

// Update the logged-in owner's restaurant details and optionally its image.
ownerRouter.put("/restaurant",upload.single("image"),updateOwnerRestaurant);

// Retrieve bookings made at the logged-in owner's restaurant.
ownerRouter.get("/bookings", getOwnerBookings);

// Update the status of a specific booking.
ownerRouter.put("/bookings//status", updateBookingStatus);


module.exports = ownerRouter;