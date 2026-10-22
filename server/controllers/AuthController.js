const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

// Register a new user
// POST/api/auth/register
const registerUser = async (req, res) => {
    try{
        const {name, email, password, phone, role} = req.body;

        // Check required fields
        if(!name || !email || !password){
            return res.status(400).json({message: "Please enter all required fields!"})
        }
        
        // Check if user already exists
        const userExists = await User.findOne({email: email.trim().toLowerCase()})
        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Only allow public registration as a user or restaurant owner.
        // Admin accounts should be created securely by an administrator.
        const userRole = role === 'owner' ? 'owner' : 'user';

        // Create a user
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword,
            phone,
            role: userRole
        })

        // Generate token
        const token = generateToken(user._id.toString());

        return res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: 'Server error during registration'})
    }
}

// Authenticate a user and get token
// POST/api/auth/login
const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        // Check required fields
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password!"})
        }
        
        // Find User
        const user = await User.findOne({email: email.trim().toLowerCase()})
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }

         // Generate token
        const token = generateToken(user._id.toString());

        return res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token
            })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: 'Server error during login'})
    }
}  


// Get logged-in user's information
// GET /api/auth/me
const getUser = (req, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"Not authorized"})
        }
        return res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: 'Server error while fetching user'})
    }
}

module.exports = {registerUser, loginUser, getUser};