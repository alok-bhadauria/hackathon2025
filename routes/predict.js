import express from "express";
import multer from "multer";
import * as tf from "@tensorflow/tfjs";
import { predictSoilType } from "../ml/inference.js";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ error: "No file uploaded" });
        }

        const buffer = new Uint8Array(req.file.buffer);

        // tfjs-only safe decoder (no tfjs-node)
        const image = await tf.node.decodeImage(buffer, 3); // Works only if tfjs-node is installed
        // If tfjs-node is not installed, use pure JS fallback:
        // const blobUrl = URL.createObjectURL(new Blob([buffer]));
        // const img = await loadImage(blobUrl);
        // const image = tf.browser.fromPixels(img);

        const result = await predictSoilType(image);

        res.json({
            success: true,
            soilType: result.name,
            crops: result.crops,
            seasons: result.seasons
        });

    } catch (err) {
        res.json({ error: err.message });
    }
});

export default router;
