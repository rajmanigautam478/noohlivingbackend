const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.resolve(__dirname, "../../uploads/collections");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image allowed"));
    }
  },
});
