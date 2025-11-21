const express = require("express");
const router = express.Router();
const multer = require("multer");
const infer = require("../ml/predict");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: "No image uploaded" });
    }

    const result = await infer(req.file.buffer);
    return res.json(result);

  } catch (err) {
    console.error("Prediction error:", err);
    res.json({ error: "Prediction failed" });
  }
});

module.exports = router;
