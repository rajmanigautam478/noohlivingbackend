const express = require("express");
const cors = require("cors");

const app = express();
const categoryRoutes = require("./routes/category.routes");
const serviceRoutes = require("./routes/service.routes");


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/services", serviceRoutes);


// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Nooh Living Backend",
  });
});

module.exports = app;
