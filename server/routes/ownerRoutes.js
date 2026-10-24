
const { Router } = require("express");

const upload = require("../config/multer");

const {
  protect,
  ownerOnly,
} = require("../middlewares/auth.js");

const {
  getOwnerRestaurant,
  createOwnerRestaurant,
  updateOwnerRestaurant,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/OwnerController");

const ownerRouter = Router();

// Authentication and authorization
ownerRouter.use(protect);
ownerRouter.use(ownerOnly);

// Restaurant management
ownerRouter.get("/restaurant", getOwnerRestaurant);

ownerRouter.post(
  "/restaurant",
  upload.single("image"),
  createOwnerRestaurant
);

ownerRouter.put(
  "/restaurant",
  upload.single("image"),
  updateOwnerRestaurant
);

// Booking management
ownerRouter.get("/bookings", getOwnerBookings);

ownerRouter.put(
  "/bookings/:id/status",
  updateBookingStatus
);

module.exports = ownerRouter;
