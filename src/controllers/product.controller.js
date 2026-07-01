const mongoose = require("mongoose");
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      compareAtPrice,
      category,
      collectionName,
      featured,
      inStock,
      isActive,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (price === undefined || price === null || isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: "Valid product price is required",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description || "",
      shortDescription: shortDescription || "",
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      category: category || "",
      collectionName: collectionName || "",
      featured: featured === true || featured === "true",
      inStock: inStock !== false && inStock !== "false",
      isActive: isActive !== false && isActive !== "false",
      image: req.file ? `/uploads/products/${req.file.filename}` : "",
      images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, collectionName, featured, inStock, isActive, limit, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (collectionName) {
      filter.collectionName = collectionName;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (inStock !== undefined) {
      filter.inStock = inStock === "true";
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const query = Product.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query.limit(Number(limit));
    }

    const products = await query;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (mongoose.isValidObjectId(idOrSlug)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {};

    if (req.body.name !== undefined) updateData.name = req.body.name.trim();
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.shortDescription !== undefined) updateData.shortDescription = req.body.shortDescription;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.compareAtPrice !== undefined) updateData.compareAtPrice = req.body.compareAtPrice ? Number(req.body.compareAtPrice) : null;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.collectionName !== undefined) updateData.collectionName = req.body.collectionName;
    
    if (req.body.featured !== undefined) {
      updateData.featured = req.body.featured === true || req.body.featured === "true";
    }
    
    if (req.body.inStock !== undefined) {
      updateData.inStock = req.body.inStock === true || req.body.inStock === "true";
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === true || req.body.isActive === "true";
    }

    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    if (req.body.images !== undefined) {
      updateData.images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
