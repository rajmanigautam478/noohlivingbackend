const Service = require("../models/Service");

exports.createService = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (!body.title || !body.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Service title is required",
      });
    }

    let features = [];
    if (body.features) {
      try {
        features = typeof body.features === "string" ? JSON.parse(body.features) : body.features;
      } catch (e) {
        features = [];
      }
    }

    const service = await Service.create({
      title: body.title.trim(),
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      icon: body.icon || "",
      image: req.file ? `/uploads/services/${req.file.filename}` : "",
      category: body.category || "",
      ctaText: body.ctaText || "",
      ctaLink: body.ctaLink || "",
      features,
    });

    res.status(201).json({
      success: true,
      data: service,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getServices = async (req, res) => {
  try {

    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.getService = async (req, res) => {

  try {

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      data: service,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.updateService = async (req, res) => {

  try {

    const service = await Service.findById(req.params.id);

    if (!service) {

      return res.status(404).json({
        success: false,
        message: "Service not found",
      });

    }

    const body = req.body && typeof req.body === "object" ? req.body : {};

    const updateData = {
      title: body.title,
      shortDescription: body.shortDescription,
      description: body.description,
      icon: body.icon,
      category: body.category,
      ctaText: body.ctaText,
      ctaLink: body.ctaLink,
    };

    if (body.features !== undefined) {
      let features = [];
      try {
        features = typeof body.features === "string" ? JSON.parse(body.features) : body.features;
      } catch (e) {
        features = [];
      }
      updateData.features = features;
    }

    if (req.file) {
      updateData.image = `/uploads/services/${req.file.filename}`;
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      data: updated,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

exports.deleteService = async (req, res) => {

  try {

    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Service deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};