const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mainRoutes = require("./routes/main");
const predictRoutes = require("./routes/predict");

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.use("/", mainRoutes);
app.use("/", predictRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
