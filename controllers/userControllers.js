const asyncHandler = require('express-async-handler');

const errorResponse = require('../functions/errorResponse');

// User database model
const User = require('../models/userModel');

exports.signup = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    // Check if all required fields are sent in the request
    if (!firstName || !lastName || !email || !password ) return errorResponse(res, 400, "Please fill all the fields");
    // Check that the email is valid and not in use
    if (await User.findOne({ email })) return errorResponse(res, 400, "This email is already in use");
    // Create a new user
    const user = await User.create({
        firstName: req.body.firstName,    
        lastName: req.body.lastName,  
        email: req.body.email,    
        phone: req.body.phone, 
        password: req.body.password,
    });
    // Check if error occured during creation
    if (!user) return errorResponse(res, 400, "Error occured creating new account");
    // Remove password from response
    user.password = undefined;
    // return success response ( 201 = created successfully)
    res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Account created successfully",
        data: user
    });
});

exports.signin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // Check if all required fields are sent in the request
    if (!email || !password ) return errorResponse(res, 400, "Please fill all the fields")
    // Check user email and password
    const user = await User.findOne({ email, password});
    if (!user) return errorResponse(res, 400, "Wrong email or passowrd");
    // Remove password from response
    user.password = undefined;
    // Return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Logged  in successfully",
        data: user
    });
})