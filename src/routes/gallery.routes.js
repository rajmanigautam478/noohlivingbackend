const express = require("express");
const router = express.Router();
const upload = require("../middlewere/galleryUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");
const {
  createGallery,
  getGalleries,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../controllers/gallery.controller");

router.get("/", getGalleries);
router.get("/:id", getGallery);
router.post("/", protectAdmin, upload.single("image"), createGallery);
router.put("/:id", protectAdmin, upload.single("image"), updateGallery);
router.delete("/:id", protectAdmin, deleteGallery);

module.exports = router;
