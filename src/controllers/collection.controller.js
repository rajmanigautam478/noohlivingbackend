const mongoose = require("mongoose");
const Collection = require("../models/Collection");

exports.createCollection = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
      description: description || "",
      image: req.file ? `/uploads/collections/${req.file.filename}` : "",
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Collection name must be unique",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCollections = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const collections = await Collection.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let collection;

    if (mongoose.isValidObjectId(idOrSlug)) {
      collection = await Collection.findById(idOrSlug);
    } else {
      collection = await Collection.findOne({ slug: idOrSlug });
    }

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    }

    if (req.file) {
      updateData.image = `/uploads/collections/${req.file.filename}`;
    }

    const updatedCollection = await Collection.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedCollection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Collection name must be unique",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
