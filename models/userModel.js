const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "Too short password"]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    liked: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        default: []
    }],
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);