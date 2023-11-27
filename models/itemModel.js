const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('Item', itemSchema);