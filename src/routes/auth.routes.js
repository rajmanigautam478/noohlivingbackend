const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { protectAdmin } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protectAdmin, logout);

module.exports = router;
