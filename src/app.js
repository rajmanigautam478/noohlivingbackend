const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const serviceRoutes = require("./routes/service.routes");
const projectRoutes = require("./routes/project.routes");
const testimonialRoutes = require("./routes/testimonial.routes");
const homeRoutes = require("./routes/home.routes");
const contactRoutes = require("./routes/contact.routes");
const galleryRoutes = require("./routes/gallery.routes");
const blogRoutes = require("./routes/blog.routes");
const collectionRoutes = require("./routes/collection.routes");
const productRoutes = require("./routes/product.routes");
const heroRoutes = require("./routes/hero.routes");

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hero", heroRoutes);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Nooh Living Backend",
  });
});

module.exports = app;
