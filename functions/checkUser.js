const User = require('../models/userModel');
const mongoose = require('mongoose');

const checkUser = async (res, userId, role = "user") => {
    // Check if user id is sent in the request
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
            status: "Failed",
            statusCode: 400,
            message: "Invalid user id"
        });
        return null;
    }
    // Check user exists and role = user
    const user = await User.findOne({_id: userId});
    if(!user){
        res.status(401).json({
            status: "Failed",
            statusCode: 401,
            message: "User is not found"
        });
        return null;
    }
    if(user.role !== role) {
        // 401 = not authorized to use this route
        res.status(401).json({
            status: "Failed",
            statusCode: 401,
            message: "Unauthorized user"
        });
        return null;
    }
    return user;
}

module.exports = checkUser;