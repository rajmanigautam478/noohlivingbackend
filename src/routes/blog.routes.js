const express = require("express");
const router = express.Router();
const upload = require("../middlewere/blogUpload");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blog.controller");

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlog);
router.post("/", upload.single("image"), createBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
