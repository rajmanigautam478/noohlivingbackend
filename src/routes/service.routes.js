const express = require("express");

const router = express.Router();

const upload = require("../middlewere/serviceUpload");

const {
  createService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/service.controller");

router.post("/", upload.single("image"), createService);

router.get("/", getServices);

router.get("/:id", getService);

router.put("/:id", upload.single("image"), updateService);

router.delete("/:id", deleteService);

module.exports = router;