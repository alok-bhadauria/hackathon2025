import express from "express";
import path from "path";
import mainRoutes from "./routes/main.js";
import predictRoutes from "./routes/predict.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Needed for ES modules
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", mainRoutes);
app.use("/predict", predictRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
