const express = require('express');

// Controllers
const {
    getAllItems,
    getOneItem,
    compareTwoItems,
    addItem,
    deleteItem
} = require("../controllers/itemControllers");

// Router
const router = express.Router();

// Admin routes
router.route("/addItem").post(addItem);
router.route("/deleteItem/:id").delete(deleteItem);

// User routes
router.route("/all").get(getAllItems);
router.route("/compare").get(compareTwoItems);
router.route("/:id").get(getOneItem);


module.exports = router;