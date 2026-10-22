const {Router} = require('express');
const {getUser, loginUser, registerUser} = require('../controllers/AuthController.js');
const { protect } = require('../middlewares/auth.js');

const authRouter = Router();

// Register a new user
authRouter.post('/register', registerUser);

// Login an existing user
authRouter.post('/login', loginUser);

// Get currently logged-in user's details
authRouter.post('/me', protect, getUser);

module.exports = authRouter;