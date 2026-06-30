const express = require("express");

const router = express.Router();

const upload = require("../middlewere/serviceUpload");
const authenticateAdmin = require("../middlewares/auth.middleware");

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.post("/", authenticateAdmin, upload.single("image"), createService);

router.get("/", getServices);

router.get("/:id", getService);

router.put("/:id", authenticateAdmin, upload.single("image"), updateService);

router.delete("/:id", authenticateAdmin, deleteService);

module.exports = router;