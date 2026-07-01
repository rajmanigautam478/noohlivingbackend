const Gallery = require("../models/Gallery");

exports.createGallery = async (req, res) => {
  try {
    const { title, category, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gallery image is required",
      });
    }

    const gallery = await Gallery.create({
      title: title ? title.trim() : "",
      category: category ? category.trim() : "",
      image: `/uploads/gallery/${req.file.filename}`,
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getGalleries = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const galleries = await Gallery.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: galleries.length,
      data: galleries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = req.body.title.trim();
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category.trim();
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    }

    if (req.file) {
      updateData.image = `/uploads/gallery/${req.file.filename}`;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedGallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery item deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
