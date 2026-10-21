const { model, Schema } = require('mongoose');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        phone: {
            type: String,
            trim: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: ["user", "admin", "owner"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

const User = model('User', UserSchema);

module.exports = User;