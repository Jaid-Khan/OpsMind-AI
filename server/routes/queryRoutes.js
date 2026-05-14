const express = require("express");

const router = express.Router();

const {
  queryDocs,
  queryDocsStream,
  getSourcePreview,
} = require("../controllers/queryController");

// ✅ Normal query
router.post("/", queryDocs);

// ✅ Streaming query
router.post("/stream", queryDocsStream);

// ✅ Source preview
router.get("/source-preview", getSourcePreview);

module.exports = router;