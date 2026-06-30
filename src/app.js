const express = require("express");
const cors = require("cors");

const app = express();
const categoryRoutes = require("./routes/category.routes");
const serviceRoutes = require("./routes/service.routes");
const projectRoutes = require("./routes/project.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const homeRoutes = require("./routes/home.routes");
const contactRoutes = require("./routes/contact.routes");
const adminRoutes = require("./routes/admin.routes");


// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);


// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Nooh Living Backend",
  });
});

module.exports = app;
