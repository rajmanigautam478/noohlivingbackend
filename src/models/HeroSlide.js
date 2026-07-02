const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    ctaText: {
      type: String,
      default: "",
    },
    ctaLink: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
