const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth.middleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.post("/", authenticateAdmin, createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.put("/:id", authenticateAdmin, updateProject);
router.delete("/:id", authenticateAdmin, deleteProject);

module.exports = router;
