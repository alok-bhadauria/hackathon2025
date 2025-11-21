import * as tf from "@tensorflow/tfjs";

let model = null;
let soilInfo = null;

export async function loadModel() {
    if (!model) {
        model = await tf.loadLayersModel("file://ml/model.json");
    }
    if (!soilInfo) {
        soilInfo = await import("./soil_info.json", { assert: { type: "json" }}).then(m => m.default);
    }
}

export async function predictSoilType(imageTensor) {
    await loadModel();

    const resized = tf.image.resizeBilinear(imageTensor, [180, 180]);
    const normalized = resized.div(255).expandDims(0);

    const prediction = model.predict(normalized);
    const values = await prediction.data();
    const index = values.indexOf(Math.max(...values));

    return soilInfo[index];
}
