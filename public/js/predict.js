async function analyzeImage() {
  const fileInput = document.getElementById("imageInput");
  const resultBox = document.getElementById("resultBox");

  if (!fileInput.files.length) return;

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const res = await fetch("/predict", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.error) {
    resultBox.innerHTML = "<b>Error:</b> " + data.error;
  } else {
    resultBox.innerHTML = `
      <b>Soil Type:</b> ${data.label}<br>
      <b>Confidence:</b> ${(data.confidence * 100).toFixed(2)}%
      <br><br>
      <b>Best Crops:</b> ${data.crops.join(", ")}<br>
      <b>Best Season:</b> ${data.season}
    `;
  }
}
