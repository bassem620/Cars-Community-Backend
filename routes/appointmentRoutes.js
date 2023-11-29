const express = require('express');

// Controllers
const {
    getAllAppointments,
    getOneAppointment,
    myAppointments,
    addAppointment,
    deleteAppointment
} = require("../controllers/appointmentControllers");

// Router
const router = express.Router();

// User routes
router.route("/addAppointment").post(addAppointment);
router.route("/myAppointments").get(myAppointments);

// Admin routes
router.route("/all").get(getAllAppointments);

// User & Admin routes
router.route("/deleteAppointment/:id").delete(deleteAppointment);
router.route("/:id").get(getOneAppointment);



module.exports = router;