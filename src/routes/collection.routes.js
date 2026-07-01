const express = require("express");
const router = express.Router();
const upload = require("../middlewere/collectionUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");
const {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

router.get("/", getCollections);
router.get("/:idOrSlug", getCollection);
router.post("/", protectAdmin, upload.single("image"), createCollection);
router.put("/:id", protectAdmin, upload.single("image"), updateCollection);
router.delete("/:id", protectAdmin, deleteCollection);

module.exports = router;
