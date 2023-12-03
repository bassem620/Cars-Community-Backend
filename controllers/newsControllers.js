const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const checkUser = require('../functions/checkUser');
const errorResponse = require('../functions/errorResponse');

// News database model
const News = require("../models/newsModel");

exports.getAllNews = asyncHandler(async (req, res) => {
    const news = await News.find({});
    // Check no errors happend when retrieving all news
    if(!news) return errorResponse(res, 400, "Error occured");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: news
    });
});

exports.getOneNews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check if new id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "New id is invalid");
    const news = await News.findOne({_id: id});
    // Check no errors happend when retrieving new
    if(!news) return errorResponse(res, 400, "New is not found");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: news
    });
});

exports.addNews = asyncHandler(async (req, res) => {
    const { title, desc, image, userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check all required fields are sent in the request
    if(!title || !desc || !image) return errorResponse(res, 400, "Please fill all the fields");
    // Create new New
    const newNews = await News.create(req.body);
    // Check if error occurred
    if (!newNews) return errorResponse(res, 400, "Error occured during creating new news");
    // return success response ( 201 = created successfully)
    return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "News is created successfully",
        data: newNews
    });
});

exports.deleteNews = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check if news id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "New id is invalid");
    const news = await News.findOne({_id: id});
    // Check if the needed new exists
    if(!news) {
        // 404 = NOT FOUND
        return errorResponse(res, 404, "This new is not found");
    }
    if(await News.deleteOne({_id: id})) {
        // return success response ( 204 = no content = deleted successfully)
        return res.status(204).json({
            status: "Success",
            statusCode: 204,
            message: "This new is deleted successfully"
        });
    }
    // return fail response
    return errorResponse(res, 400, "Error occured during deleting the new");
});
