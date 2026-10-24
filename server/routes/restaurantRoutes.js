const { Router } = require("express");

const {getRestaurant, getFeaturedRestaurant, getRestaurantBySlug, getRestaurantAvailability,} = require("../controllers/RestaurantController");

const restaurantRouter = Router();

// Get all approved restaurants, with optional filters
// GET /api/restaurants
restaurantRouter.get("/", getRestaurant);

// Get featured and exclusive restaurants
// GET /api/restaurants/featured
restaurantRouter.get("/featured", getFeaturedRestaurant);

// Get availability for a restaurant on a selected date
// GET /api/restaurants/:id/availability
restaurantRouter.get("/:id/availability", getRestaurantAvailability);

// Get restaurant details using its slug
// GET /api/restaurants/:slug
restaurantRouter.get("/:slug", getRestaurantBySlug);

module.exports = restaurantRouter;