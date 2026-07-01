const express = require("express");
const router = express.Router();
const upload = require("../middlewere/collectionUpload");
const {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

router.get("/", getCollections);
router.get("/:idOrSlug", getCollection);
router.post("/", upload.single("image"), createCollection);
router.put("/:id", upload.single("image"), updateCollection);
router.delete("/:id", deleteCollection);

module.exports = router;
