const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify the user's JWT token
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'No token provided. Not authorized.' });
    }

    try {
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({message: 'User not found. Not authorized.'});
        }

        req.user = user;
        return next();
    } 
    catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({message: 'Invalid token. Not authorized.' });
    }
};

// Allow only admins
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin only.'});
};

// Allow restaurant owners and admins
const ownerOnly = (req, res, next) => {
    if (
        req.user &&
        (req.user.role === 'owner' || req.user.role === 'admin')
    ) {
        return next();
    }

    return res.status(403).json({ message: 'Access denied. Restaurant owner only.'});
};

module.exports = { protect, adminOnly, ownerOnly };