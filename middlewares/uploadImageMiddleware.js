const multer = require("multer");

// Configure Multer storage
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueFilename = Date.now() + '-' + file.originalname;
        cb(null, uniqueFilename);
    },
});

// Create a Multer upload instance
exports.upload = multer({ storage });
