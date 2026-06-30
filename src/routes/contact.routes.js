const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middlewares/auth.middleware");

const { createContact, getContacts } = require("../controllers/controller.controller");

router.post("/", createContact);
router.get("/", authenticateAdmin, getContacts);

module.exports = router;
