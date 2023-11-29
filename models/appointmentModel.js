const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
    }
}, {timestamps: true});

module.exports = mongoose.model('Appointment', appointmentSchema);