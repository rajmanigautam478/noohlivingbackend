const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth.middleware");
const { adminLogin, createAdmin, getAdminProfile } = require("../controllers/admin.controller");

router.post("/login", adminLogin);
router.post("/register", createAdmin);
router.get("/profile", authenticateAdmin, getAdminProfile);

module.exports = router;
