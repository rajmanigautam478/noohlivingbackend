const Service = require("../models/Service");
const Project = require("../models/project.model");
const Testimonial = require("../models/Testimonial");
const Gallery = require("../models/Gallery");
const HeroSlide = require("../models/HeroSlide");

exports.getHomePage = async (req, res) => {
  try {
    const [services, projects, testimonials, gallery, heroSlides] = await Promise.all([
      Service.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Project.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Testimonial.find({ isActive: true }).sort({ createdAt: -1 }).limit(6),
      Gallery.find({ isActive: true }).sort({ createdAt: -1 }).limit(8),
      HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        services,
        projects,
        testimonials,
        gallery,
        heroSlides,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
