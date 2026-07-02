const Contact = require("../models/contact.model");

exports.createContact = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (!body.name || !body.name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!body.email || !body.email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!body.message || !body.message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const contact = await Contact.create({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone || "",
      subject: body.subject || "",
      message: body.message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

