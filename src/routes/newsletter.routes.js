const express = require("express");
const router = express.Router();
const {
  subscribeNewsletter,
  getNewsletters,
  deleteNewsletter,
} = require("../controllers/newslatter.controller");

router.post("/subscribe", subscribeNewsletter);
router.get("/", getNewsletters);
router.delete("/:id", deleteNewsletter);

module.exports = router;
