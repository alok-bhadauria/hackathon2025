from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from PIL import Image
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "soil_model.h5"
from tensorflow.keras.layers import Rescaling

custom_objects = {
    "Rescaling": Rescaling,
    "TrueDivide": tf.math.divide  
}

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects=custom_objects,
    compile=False
)


CLASS_NAMES = [
    "Alluvial_Soil",
    "Arid_Soil",
    "Black_Soil",
    "Laterite_Soil",
    "Mountain_Soil",
    "Red_Soil",
    "Yellow_Soil"
]

SOIL_INFO = {
    "Alluvial_Soil": {
        "crops": ["Wheat", "Rice", "Sugarcane", "Pulses"],
        "season": "Best in Kharif & Rabi"
    },
    "Arid_Soil": {
        "crops": ["Bajra", "Jowar", "Guar"],
        "season": "Summer season"
    },
    "Black_Soil": {
        "crops": ["Cotton", "Soybean", "Groundnut"],
        "season": "Kharif"
    },
    "Laterite_Soil": {
        "crops": ["Tea", "Coffee", "Cashew Nuts"],
        "season": "Monsoon & Winter"
    },
    "Mountain_Soil": {
        "crops": ["Tea", "Spices", "Fruits"],
        "season": "Cold & Temperate seasons"
    },
    "Red_Soil": {
        "crops": ["Millets", "Potato", "Groundnut"],
        "season": "Kharif & Winter"
    },
    "Yellow_Soil": {
        "crops": ["Peas", "Pulses", "Cotton"],
        "season": "Rabi"
    }
}

def preprocess_image(image: Image.Image):
    image = image.resize((224, 224))     
    image = np.array(image).astype("float32") / 255.0
    image = np.expand_dims(image, axis=0)
    return image

@app.post("/predict")
async def predict_soil(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        processed = preprocess_image(image)

        preds = model.predict(processed)
        idx = np.argmax(preds)
        soil_type = CLASS_NAMES[idx]

        return {
            "soil_type": soil_type,
            "crops": SOIL_INFO[soil_type]["crops"],
            "season": SOIL_INFO[soil_type]["season"]
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("ml_server:app", host="127.0.0.1", port=5000, reload=True)
