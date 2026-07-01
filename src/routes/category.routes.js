const express = require("express");
const router = express.Router();
const upload = require("../middlewere/upload");
const { protectAdmin } = require("../middlewares/auth.middleware");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", protectAdmin, upload.single("image"), createCategory);
router.put("/:id", protectAdmin, upload.single("image"), updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

router.post("/test", protectAdmin, (req, res) => {
  res.json({
    success: true,
    message: "POST Route Working",
  });
});

module.exports = router;