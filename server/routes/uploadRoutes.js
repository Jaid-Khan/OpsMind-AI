const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const { uploadPDF } = require("../controllers/uploadController");

if (!uploadPDF) {
  throw new Error("uploadPDF is undefined ❌");
}

router.post("/upload", upload.single("file"), uploadPDF);

module.exports = router;