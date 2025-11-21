import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

function soilReport() {
    const soilTypes = [
        "Alluvial Soil",
        "Black Soil",
        "Red Soil",
        "Arid Soil",
        "Laterite Soil",
        "Mountain Soil",
        "Yellow Soil"
    ];

    const crops = {
        "Alluvial Soil": ["Wheat", "Rice", "Maize", "Sugarcane"],
        "Black Soil": ["Cotton", "Millets", "Soybean"],
        "Red Soil": ["Groundnut", "Ragi", "Pulses"],
        "Arid Soil": ["Bajra", "Jowar", "Guar"],
        "Laterite Soil": ["Tea", "Coffee", "Cashew"],
        "Mountain Soil": ["Apples", "Barley", "Potatoes"],
        "Yellow Soil": ["Pulses", "Peas", "Groundnut"]
    };

    const region = [
        "Indo-Gangetic Plains",
        "Deccan Plateau",
        "Western Ghats",
        "Rajasthan",
        "Himalayan Hills",
        "Eastern Coastal Plains"
    ];

    const waterHolding = [
        "Low",
        "Moderate",
        "High"
    ];

    const fertility = [
        "Low Fertility",
        "Moderate Fertility",
        "Highly Fertile"
    ];

    const chosenType = soilTypes[Math.floor(Math.random() * soilTypes.length)];

    return {
        soil_type: chosenType,
        best_crops: crops[chosenType],
        region: region[Math.floor(Math.random() * region.length)],
        water_capacity: waterHolding[Math.floor(Math.random() * waterHolding.length)],
        fertility: fertility[Math.floor(Math.random() * fertility.length)],
        ph: (Math.random() * (8.5 - 5.5) + 5.5).toFixed(2),
        organic_carbon: (Math.random() * 1.5).toFixed(2) + "%",
    };
}

// POST route
router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.render("index", { error: "No image uploaded.", result: null });
    }

    const result = soilReport();

    res.render("index", {
        result: {
            image_path: "/uploads/" + req.file.filename,
            ...result
        },
        error: null
    });
});

export default router;
