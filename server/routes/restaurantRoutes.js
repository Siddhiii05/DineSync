const {Router} = require('express');
const {getRestaurant, getFeaturedRestaurant, getRestaurantBySlug, getRestaurantAvailability} = require('../controllers/RestaurantController')

const restaurantRouter = Router()

// Get all approved restaurants, with optional filters
restaurantRouter.get('/', getRestaurant);

// Get featured restaurants
restaurantRouter.get('/featured', getFeaturedRestaurant);

// Get restaurant details using its slug
restaurantRouter.get('/', getRestaurantBySlug);

// Get availability for a restaurant on a selected date
restaurantRouter.get('//availability', getRestaurantAvailability);

module.exports = restaurantRouter;