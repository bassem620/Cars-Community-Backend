const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const checkUser = require('../functions/checkUser');
const errorResponse = require('../functions/errorResponse');

// Car & User database model
const Car = require("../models/carModel");
const User = require("../models/userModel");

exports.getAllCars = asyncHandler(async (req, res) => {
    const cars = await Car.find({});
    // Check no errors happend when retrieving all cars
    if(!cars) return errorResponse(res, 400, "Error occured");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: cars
    });
});

exports.getOneCar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check if car id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "Car id is invalid");
    const car = await Car.findOne({_id: id});
    // Check no errors happend when retrieving car
    if(!car) return errorResponse(res, 400, "Car is not found");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: car
    });
});

exports.compareTwoCars = asyncHandler(async (req, res) => {
    const { car1Id, car2Id } = req.body;
    // Check if cars ids is valid
    if(!mongoose.Types.ObjectId.isValid(car1Id) || !mongoose.Types.ObjectId.isValid(car2Id)){
        return errorResponse(res, 400, "Car id is invalid");
    }
    const car1 = await Car.findOne({_id: car1Id});
    const car2 = await Car.findOne({_id: car2Id});
    if(!car1 || !car2) return errorResponse(res, 400, "One or bboth of the 2 cars is not found");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        car1,
        car2
    })
});

exports.addCar = asyncHandler(async (req, res) => {
    const { title, desc, price, image, userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check all required fields are sent in the request
    if(!title || !desc || !price || !image) return errorResponse(res, 400, "Please fill all the fields");
    // Create new car
    const newCar = await Car.create(req.body);
    // Check if error occurred
    if (!newCar) return errorResponse(res, 400, "Error occured during creating new car");
    // return success response ( 201 = created successfully)
    return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Car created successfully",
        data: newCar
    });
});

exports.deleteCar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check if car id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "Car id is invalid");
    // Check if the needed car exists
    const car = await Car.findOne({_id: id});
    if(!car) {
        // 404 = NOT FOUND
        return errorResponse(res, 404, "This car is not found");
    }
    if(await Car.deleteOne({_id: id})) {
        // return success response ( 204 = no content = deleted successfully)
        return res.status(204).json({
            status: "Success",
            statusCode: 204,
            message: "This car is deleted successfully"
        });
    }
    // return fail response
    return errorResponse(res, 400, "Error occured during deleting the ite");
});

exports.likeChange = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId, newLikeState } = req.body;
    // Check user
    const user = await checkUser(res, userId, "user");
    if(!user) return;
    // Check if car id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "Car id is invalid");
    // Check if the needed car exists
    const car = await Car.findOne({_id: id});
    if(!car) {
        // 404 = NOT FOUND
        return errorResponse(res, 404, "This car is not found");
    }
    // check that newLikeState is sent in the request
    if(newLikeState !== true && newLikeState !== false) {
        return errorResponse(res, 400, "New like state is required");
    }
    // logic based on newLikeState
    if(newLikeState === true) {
        await likeCar(res, user, id);
    } else if (newLikeState === false) {
        await unlikeCar(res, user, id);
    }
    return;
});

const likeCar = async (res, user, carId) => {
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $addToSet: { favorites: carId } },
        { new: true}
    );
    return res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: updatedUser
    })
}

const unlikeCar = async (res, user, carId) => {
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { favorites: carId } },
        { new: true}
    );
    return res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: updatedUser
    })
}