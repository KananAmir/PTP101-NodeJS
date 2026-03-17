const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        }
    },
    { timestamps: true, versionKey: false }
);
``
const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel

