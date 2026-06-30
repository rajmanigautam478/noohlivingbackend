const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth.middleware");

const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");

router.post("/", authenticateAdmin, createTestimonial);
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.put("/:id", authenticateAdmin, updateTestimonial);
router.delete("/:id", authenticateAdmin, deleteTestimonial);

module.exports = router;
