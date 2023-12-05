const express = require('express');

// Controllers
const {
    getAllCars,
    getFavorites,
    getOneCar,
    compareTwoCars,
    addCar,
    deleteCar,
    likeChange
} = require("../controllers/carControllers");

// Multer controllers
const {upload} = require("../middlewares/uploadImageMiddleware");

// Router
const router = express.Router();

// Admin routes
router.route("/addCar").post(upload.single("image"), addCar);
router.route("/deleteCar/:id").delete(deleteCar);

// User routes
router.route("/all").get(getAllCars);
router.route("/favorites").post(getFavorites);
router.route("/compare").post(compareTwoCars);
router.route("/likeChange/:id").post(likeChange);
router.route("/:id").get(getOneCar);


module.exports = router;