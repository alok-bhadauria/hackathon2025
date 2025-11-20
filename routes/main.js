const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Hackathon Project" });
});

const Test = require("../models/Test");

router.get("/test-db", async (req, res) => {
  try {
    const record = await Test.create({ name: "Hackathon" });
    res.send("DB Write Success: " + record._id);
  } catch (err) {
    res.send("DB Error: " + err.message);
  }
});


module.exports = router;
