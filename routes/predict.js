import express from "express";
import multer from "multer";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: form
    });

    const result = await response.json();

    fs.unlinkSync(req.file.path);

    res.render("index", { result, error: null });

  } catch (err) {
    console.error(err);
    res.render("index", { result: null, error: "Prediction failed." });
  }
});

export default router;
