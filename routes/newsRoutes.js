const express = require('express');

// Controllers
const {
    getAllNews,
    getOneNews,
    addNews,
    deleteNews
} = require("../controllers/newsControllers");

// Multer controllers
const {upload} = require("../middlewares/uploadImageMiddleware");

// Router
const router = express.Router();

// Admin routes
router.route("/addNews").post(upload.single("image"), addNews);
router.route("/deleteNews/:id").delete(deleteNews);

// User routes
router.route("/all").get(getAllNews);
router.route("/:id").get(getOneNews);


module.exports = router;