const express = require("express");
const router = express.Router();
const upload = require("../middlewere/upload");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

router.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "POST Route Working",
  });
});

module.exports = router;