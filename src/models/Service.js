const mongoose = require("mongoose");
const slugify = require("slugify");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
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

serviceSchema.pre("save", async function () {
  try {
    if (!this.slug && this.title) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("Service", serviceSchema);