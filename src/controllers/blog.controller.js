const mongoose = require("mongoose");
const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const { title, shortDescription, description, author, isActive } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog description/content is required",
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      shortDescription: shortDescription || "",
      description: description.trim(),
      author: author || "Admin",
      image: req.file ? `/uploads/blogs/${req.file.filename}` : "",
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { isActive, limit } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const query = Blog.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query.limit(Number(limit));
    }

    const blogs = await query;

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let blog;

    if (mongoose.isValidObjectId(idOrSlug)) {
      blog = await Blog.findById(idOrSlug);
    } else {
      blog = await Blog.findOne({ slug: idOrSlug });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = req.body.title.trim();
    }

    if (req.body.shortDescription !== undefined) {
      updateData.shortDescription = req.body.shortDescription;
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description.trim();
    }

    if (req.body.author !== undefined) {
      updateData.author = req.body.author;
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    }

    if (req.file) {
      updateData.image = `/uploads/blogs/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
