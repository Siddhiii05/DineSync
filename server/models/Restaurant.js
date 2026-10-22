const { model, Schema, Types } = require('mongoose');

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    cuisine: {
        type: String,
        required: true,
        trim: true
    },
    priceRange: {
        type: String,
        enum: ['$', '$$', '$$$', '$$$$'],
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0,  
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    chef: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    availableSlots: {
        type: [String],
        default: []
    },
    featured: {
        type: Boolean,
        default: false
    },
    exclusive: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1
    }},
    {timestamps: true}
);

// Create and export the Restaurant model
const Restaurant = model('Restaurant', RestaurantSchema);

module.exports = Restaurant;