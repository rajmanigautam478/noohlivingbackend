const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
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
    price: {
      type: Number,
      required: true,
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: "",
    },
    collectionName: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
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

productSchema.pre("save", async function () {
  try {
    if (!this.slug && this.name) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("Product", productSchema);
