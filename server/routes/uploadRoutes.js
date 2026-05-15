const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { uploadPDF } = require("../controllers/uploadController");
const { protect } = require("../middlewares/authMiddleware");

if (!uploadPDF) {
  throw new Error("uploadPDF is undefined ❌");
}

// router.post("/upload", upload.single("file"), uploadPDF);

router.post("/upload", protect, upload.single("file"), uploadPDF);

module.exports = router;
