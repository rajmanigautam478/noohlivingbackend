const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth.middleware");

const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonial.controller");

router.post("/", protectAdmin, createTestimonial);
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);
router.put("/:id", protectAdmin, updateTestimonial);
router.delete("/:id", protectAdmin, deleteTestimonial);

module.exports = router;
