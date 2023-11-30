const errorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: "Failed",
        statusCode: statusCode || 400,
        message
    })
}

module.exports = errorResponse;