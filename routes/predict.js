const express = require("express");
const multer = require("multer");
const path = require("path");
const runInference = require("../ml/inference");

const router = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/uploads"),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/predict", upload.single("soilImage"), async (req, res) => {
    const imgPath = req.file.path;
    const prediction = await runInference(imgPath);
    res.json(prediction);
});

module.exports = router;
