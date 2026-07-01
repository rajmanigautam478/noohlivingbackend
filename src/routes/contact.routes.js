const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth.middleware");

const { createContact, getContacts } = require("../controllers/controller.controller");

router.post("/", createContact);
router.get("/", protectAdmin, getContacts);

module.exports = router;
