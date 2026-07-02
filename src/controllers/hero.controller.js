const HeroSlide = require("../models/HeroSlide");

exports.createHeroSlide = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (!body.heading || !body.heading.trim()) {
      return res.status(400).json({
        success: false,
        message: "Heading is required",
      });
    }

    let cleanImage = body.image || "";
    if (cleanImage.startsWith("http")) {
      try {
        const urlObj = new URL(cleanImage);
        cleanImage = urlObj.pathname;
      } catch (e) {
        // Fallback if URL parsing fails
      }
    }

    const slide = await HeroSlide.create({
      heading: body.heading.trim(),
      subheading: body.subheading || "",
      ctaText: body.ctaText || "",
      ctaLink: body.ctaLink || "",
      order: body.order ? Number(body.order) : 0,
      isActive: body.isActive !== false && body.isActive !== "false",
      image: req.file ? `/uploads/hero/${req.file.filename}` : cleanImage,
    });

    res.status(201).json({
      success: true,
      data: slide,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getHeroSlides = async (req, res) => {
  try {
    // If the request comes from the public website, we only show active ones.
    // If from admin, we might want all, but usually we filter by active or let the query handle it.
    // Let's return all sorted by order and createdAt.
    const query = {};
    if (req.query.active === "true") {
      query.isActive = true;
    }
    const slides = await HeroSlide.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: slides.length,
      data: slides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    res.json({
      success: true,
      data: slide,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({
        success: false,
        message: "Hero slide not found",
      });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};

    const updateData = {
      heading: body.heading,
      subheading: body.subheading,
      ctaText: body.ctaText,
      ctaLink: body.ctaLink,
      order: body.order !== undefined ? Number(body.order) : slide.order,
      isActive: body.isActive !== undefined ? (body.isActive !== false && body.isActive !== "false") : slide.isActive,
    };

    if (req.file) {
      updateData.image = `/uploads/hero/${req.file.filename}`;
    } else if (body.image !== undefined) {
      let cleanImage = body.image;
      if (cleanImage.startsWith("http")) {
        try {
          const urlObj = new URL(cleanImage);
          cleanImage = urlObj.pathname;
        } catch (e) {
          // Fallback if URL parsing fails
        }
      }
      updateData.image = cleanImage;
    }

    const updated = await HeroSlide.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
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

exports.deleteHeroSlide = async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Hero slide deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
