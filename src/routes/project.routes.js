const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth.middleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.post("/", protectAdmin, createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", protectAdmin, updateProject);
router.delete("/:id", protectAdmin, deleteProject);

module.exports = router;
