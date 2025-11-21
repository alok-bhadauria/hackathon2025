import express from "express";
import path from "path";
import predictRoutes from "./routes/predict.js";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/predict", predictRoutes);

app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

app.listen(3000, () => {
  console.log("Node server running at http://localhost:3000");
});
