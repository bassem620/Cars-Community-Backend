const express = require('express');

// Controllers
const { signup, signin } = require("../controllers/userControllers");

// Router
const router = express.Router();

// routes
router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);

module.exports = router;