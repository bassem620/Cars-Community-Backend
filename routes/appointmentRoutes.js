const express = require('express');

// Controllers
const {
    getAllAppointments,
    myAppointments,
    addAppointment,
    deleteAppointment
} = require("../controllers/appointmentControllers");

// Router
const router = express.Router();

// User routes
router.route("/addAppointment").post(addAppointment);
router.route("/myAppointments").post(myAppointments);
router.route("/deleteAppointment/:id").delete(deleteAppointment);

// Admin routes
router.route("/all").get(getAllAppointments);



module.exports = router;