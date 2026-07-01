const express = require("express");
const router = express.Router();
const upload = require("../middlewere/galleryUpload");
const {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallery.controller");

router.get("/", getGalleries);
router.get("/:id", getGallery);
router.post("/", upload.single("image"), createGallery);
router.put("/:id", upload.single("image"), updateGallery);
router.delete("/:id", deleteGallery);

module.exports = router;
