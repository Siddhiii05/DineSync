const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes that require authentication
const protect = async(req, res, next) => {
    // Get token from Authorization header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            // Get token from header
            const token = req.headers.authorization.split(' ')[1];
            
            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user using Id stored in token and exclude password
            const user = await User.findById(decoded.id).select('-password');
            if(!user){
                return res.status(400).json({message: "User not found. Not authorized"})
            }

            req.user = user;
            return next();
        }
        catch(error){
            console.error("Auth middleware error:", error);
            return res.status(401).json({message: 'Invalid token. Not authorized.'})
        }
    }
    // No token provided
    return res.status(401).json({message: 'No token provided. Not authorized.'});
}

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next()
    }
    else{
        res.status(403).json({message: 'Access denied, admin role required.'})
    }
}

const ownerOnly = (req, res, next) => {
    if(req.user && (req.user.role === "owner" || req.user.role === "admin")){
        next()
    }
    else{
        res.status(403).json({message: 'Access denied, restaurant owner role required.'})
    }
}

module.exports = {protect, adminOnly, ownerOnly}