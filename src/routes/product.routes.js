const express = require("express");
const router = express.Router();
const upload = require("../middlewere/productUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getProducts);
router.get("/:idOrSlug", getProduct);
router.post("/", protectAdmin, upload.single("image"), createProduct);
router.put("/:id", protectAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;
