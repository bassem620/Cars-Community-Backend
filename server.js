const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');

// Environment variables
require("dotenv").config();

// Express app
const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/user", require("./routes/userRoutes"));
app.use("/cars", require("./routes/carRoutes"));
app.use("/news", require("./routes/newsRoutes"));
app.use("/events", require("./routes/eventRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));

// Not Found Route
app.all('*', (req, res) => {
    res.status(404).json({
        status: "Failed",
        statusCode: 400,
        message: `This Route (${req.originalUrl}) is not found`,
    })
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then( (conn) => console.log(`Database Connected: ${conn.connection.host}`));

// Port Number
const PORT = 4000

// Server
app.listen(PORT, () => console.log(`Running on port ${PORT}`));