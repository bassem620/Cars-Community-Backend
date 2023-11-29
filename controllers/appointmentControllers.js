const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const checkUser = require('../functions/checkUser');

// Appointment database model
const Appointment = require("../models/appointmentModel");

exports.getAllAppointments = asyncHandler(async (req, res) => {
    // Check if logged user is admin
    const user = await checkUser(res, req.body.userId, "admin");
    if(!user) return;
    // get all appointments
    const appointments = await Appointment.find({});
    // Check no errors happend when retrieving all appointments
    if(!appointments) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Error occured"
        })
    }
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: appointments
    });
});

exports.myAppointments = asyncHandler(async (req, res) => {
    const userId = req.body?.userId;
    const user = await checkUser(res, userId, "user");
    if(!user) return;
    // Check if user id is sent in the request
    if(!user) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "User id is required"
        })
    }
    const appointments = await Appointment.find({user: user._id});
    // Check no errors happend when retrieving all appointments
    if(!appointments) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Error occured"
        })
    }
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: appointments
    });
});

exports.addAppointment = asyncHandler(async (req, res) => {
    const { userId, date } = req.body;
    const user = await checkUser(res, userId, "user");
    if(!user) return;
    // Check all required fields are sent in the request
    if(!date) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Please fill all the fields"
        });
    }
    // Create new appointment
    const newAppointment = await Appointment.create({
        user: userId,
        date
    });
    // Check if error occurred
    if (!newAppointment) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Error occured during creating new appointment"
        });
    }
    // return success response ( 201 = created successfully)
    return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Appointment created successfully",
        data: newAppointment
    });
});

exports.deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await checkUser(res, userId, "user");
    if(!user) return;
    // Check if appointment id is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Appointment id is invalid"
        })
    }
    const appointment = await Appointment.findOne({_id: id});
    // Check if the needed appointment exists
    if(!appointment) {
        // 404 = NOT FOUND
        return res.status(404).json({
            status: "Failed",
            statusCode: 404,
            message: "This appointment is not found"
        });
    }
    // Check if this appointment belongs to the logged user
    if(appointment.user.toString() !== user._id.toString()) {
        return res.status(404).json({
            status: "Failed",
            statusCode: 404,
            message: "This is not your appointment"
        });
    }
    // Delete the appointment
    if(await Appointment.deleteOne({_id: id})) {
        // return success response ( 204 = no content = deleted successfully)
        return res.status(204).json({
            status: "Success",
            statusCode: 204,
            message: "This appointment is deleted successfully"
        });
    }
    // return fail response
    return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Error occured during deleting the appointment"
    });
});
