const express = require('express');

// Controllers
const {
    getAllEvents,
    getOneEvent,
    addEvent,
    deleteEvent
} = require("../controllers/eventControllers");

// Router
const router = express.Router();

// Admin routes
router.route("/addEvent").post(addEvent);
router.route("/deleteEvent/:id").delete(deleteEvent);

// User routes
router.route("/all").get(getAllEvents);
router.route("/:id").get(getOneEvent);


module.exports = router;