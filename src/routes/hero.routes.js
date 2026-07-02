const express = require("express");
const router = express.Router();
const upload = require("../middlewere/heroUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");

const {
  createHeroSlide,
  getHeroSlides,
  getHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/hero.controller");

router.post("/", protectAdmin, upload.single("image"), createHeroSlide);
router.get("/", getHeroSlides);
router.get("/:id", getHeroSlide);
router.put("/:id", protectAdmin, upload.single("image"), updateHeroSlide);
router.delete("/:id", protectAdmin, deleteHeroSlide);

module.exports = router;
