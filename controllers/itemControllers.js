const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// Item database model
const Item = require("../models/itemModel");

exports.getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find({});
    // Check no errors happend when retrieving all items
    if(!items) {
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
        data: items
    });
});

exports.getOneItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check if item id is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Item id is invalid"
        })
    }
    const item = await Item.findOne({_id: id});
    // Check no errors happend when retrieving item
    if(!item) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Item is not found"
        })
    }
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: item
    });
});

exports.compareTwoItems = asyncHandler(async (req, res) => {
    const { item1Id, item2Id } = req.body;
    // Check if items ids is valid
    if(!mongoose.Types.ObjectId.isValid(item1Id) || !mongoose.Types.ObjectId.isValid(item2Id)){
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Item id is invalid"
        })
    }
    const item1 = await Item.findOne({_id: item1Id});
    const item2 = await Item.findOne({_id: item2Id});
    if(!item1 || !item2) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "One or bboth of the 2 items is not found"
        })
    }
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        item1,
        item2
    })
});

exports.addItem = asyncHandler(async (req, res) => {
    const { title, desc, price, image, userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check all required fields are sent in the request
    if(!title || !desc || !price || !image) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Please fill all the fields"
        });
    }
    // Create new item
    const newItem = await Item.create(req.body);
    // Check if error occurred
    if (!newItem) {
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Error occured during creating new item"
        });
    }
    // return success response ( 201 = created successfully)
    return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Item created successfully",
        data: newItem
    });
});

exports.deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check if item id is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Item id is invalid"
        })
    }
    const item = await Item.findOne({_id: id});
    // Check if the needed item exists
    if(!item) {
        // 404 = NOT FOUND
        return res.status(404).json({
            status: "Failed",
            statusCode: 404,
            message: "This item is not found"
        });
    }
    if(await Item.deleteOne({_id: id})) {
        // return success response ( 204 = no content = deleted successfully)
        return res.status(204).json({
            status: "Success",
            statusCode: 204,
            message: "This item is deleted successfully"
        });
    }
    // return fail response
    return res.status(400).json({
        status: "Failed",
        statusCode: 400,
        message: "Error occured during deleting the item"
    });
});
