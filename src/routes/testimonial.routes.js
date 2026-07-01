const express = require("express");
const router = express.Router();

const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");

router.post("/", createTestimonial);
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
