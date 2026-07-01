const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "Admin",
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

blogSchema.pre("save", async function () {
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

module.exports = mongoose.model("Blog", blogSchema);
