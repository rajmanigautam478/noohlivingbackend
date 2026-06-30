const Project = require("../models/project.model");

exports.createProject = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const {
      title,
      shortDescription,
      description,
      image,
      category,
      location,
      featured,
      isActive,
    } = body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    const project = await Project.create({
      title: title.trim(),
      shortDescription: shortDescription || "",
      description: description || "",
      image: image || "",
      category: category || "",
      location: location || "",
      featured: featured === true || featured === "true",
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { featured, category, limit } = req.query;
    const filter = {};

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (category) {
      filter.category = category;
    }

    const query = Project.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query.limit(Number(limit));
    }

    const projects = await query;

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const updateData = {};

    if (req.body.title && req.body.title.trim()) {
      updateData.title = req.body.title.trim();
    }

    if (req.body.shortDescription !== undefined) {
      updateData.shortDescription = req.body.shortDescription;
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }

    if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    if (req.body.category !== undefined) {
      updateData.category = req.body.category;
    }

    if (req.body.location !== undefined) {
      updateData.location = req.body.location;
    }

    if (req.body.featured !== undefined) {
      updateData.featured = req.body.featured === true || req.body.featured === "true";
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive !== false && req.body.isActive !== "false";
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
