const express = require("express");
const router = express.Router();
const upload = require("../middlewere/blogUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlog);
router.post("/", protectAdmin, upload.single("image"), createBlog);
router.put("/:id", protectAdmin, upload.single("image"), updateBlog);
router.delete("/:id", protectAdmin, deleteBlog);

module.exports = router;
