const Service = require("../models/Service");
const Project = require("../models/project.model");
const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");

exports.getHomePage = async (req, res) => {
  try {
    const [services, projects, testimonials, gallery] = await Promise.all([
      Service.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Project.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Gallery.find({ isActive: true }).sort({ createdAt: -1 }).limit(8),
    ]);

    res.status(200).json({
      success: true,
      data: {
        services,
        projects,
        testimonials,
        gallery,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
