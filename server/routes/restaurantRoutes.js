const {Router} = require('express');
const {getRestaurants, getFeaturedRestaurants, getRestaurantBySlug, getRestaurantAvailability} = require('../controllers/RestaurantController')

const restaurantRouter = Router()

restaurantRouter.get('/', getRestaurants);
restaurantRouter.get('/featured', getFeaturedRestaurants);
restaurantRouter.get('/featured/:slug', getRestaurantBySlug);
restaurantRouter.get('/:id/availability', getRestaurantAvailability);

module.exports = restaurantRouter