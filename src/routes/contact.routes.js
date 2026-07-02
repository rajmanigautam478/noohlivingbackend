const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middlewares/auth.middleware");

const { createContact, getContacts, updateContactStatus, deleteContact } = require("../controllers/controller.controller");

router.post("/", createContact);
router.get("/", protectAdmin, getContacts);
router.put("/:id", protectAdmin, updateContactStatus);
router.delete("/:id", protectAdmin, deleteContact);


module.exports = router;
