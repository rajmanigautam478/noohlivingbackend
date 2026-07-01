const Testimonial = require("../models/Testimonial");

exports.createTestimonial = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (!body.name || !body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!body.message || !body.message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const testimonial = await Testimonial.create({
      name: body.name.trim(),
      role: body.role || "",
      message: body.message.trim(),
      image: body.image || "",
      video: body.video || "",
      rating: body.rating || 5,
      isActive: body.isActive !== false && body.isActive !== "false",
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const updateData = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.role !== undefined) updateData.role = body.role;
    if (body.message !== undefined) updateData.message = body.message.trim();
    if (body.image !== undefined) updateData.image = body.image;
    if (body.video !== undefined) updateData.video = body.video;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.isActive !== undefined) updateData.isActive = body.isActive !== false && body.isActive !== "false";

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Testimonial deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
