const mongoose = require("mongoose");
const slugify = require("slugify");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
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

collectionSchema.pre("save", async function () {
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

module.exports = mongoose.model("Collection", collectionSchema);
