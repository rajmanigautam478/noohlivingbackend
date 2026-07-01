const express = require("express");

const router = express.Router();

const upload = require("../middlewere/serviceUpload");
const { protectAdmin } = require("../middlewares/auth.middleware");

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.post("/", protectAdmin, upload.single("image"), createService);

router.get("/", getServices);

router.get("/:id", getService);

router.put("/:id", protectAdmin, upload.single("image"), updateService);

router.delete("/:id", protectAdmin, deleteService);

module.exports = router;