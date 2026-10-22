const { model, Schema, Types } = require('mongoose');
const crypto = require('crypto');

const BookingSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            required: true,
            ref: 'User'
        },

        restaurant: {
            type: Types.ObjectId,
            required: true,
            ref: 'Restaurant'
        },

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        guests: {
            type: Number,
            required: true,
            min: 1
        },

        ocassion: {
            type: String,
            trim: true,
        },

        specialRequests: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ['confirmed', 'cancelled', 'completed'], 
            default: "confirmed"
        },

        bookingId: {
            type: String,
            unique: true
        }
    },
    {timestamps: true}
);

// Remove password when converting to JSON
BookingSchema.pre('validate', function(next) {
    if(!this.bookingId){
        this.bookingId = `GR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    }
    next();
});

const Booking = model('Booking', BookingSchema);

module.exports = Booking;