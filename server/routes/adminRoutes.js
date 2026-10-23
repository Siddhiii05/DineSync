const {Router} = require('express');
const { getAllRestaurants, approveRestaurants, getAdminStats } = require('../controllers/AdminController');
const { protect, adminOnly } = require('../middlewares/auth');

const adminRouter = Router();

adminRouter.use(protect)
adminRouter.use(adminOnly)

adminRouter.get('/restaurants', getAllRestaurants);
adminRouter.put('/restaurants/:id/approve', approveRestaurants);
adminRouter.get('/stats', getAdminStats)

module.exports = adminRouter;