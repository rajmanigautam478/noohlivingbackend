const Newsletter = require("../models/Newsletter");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const subscriber = await Newsletter.create({
      email: email.trim().toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Subscribed to newsletter successfully",
      data: subscriber,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNewsletters = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const subscribers = await Newsletter.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNewsletter = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found",
      });
    }

    await Newsletter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Subscriber removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
