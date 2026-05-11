const express = require("express");

const router = express.Router();

const {
  queryDocs,
  queryDocsStream,
} = require("../controllers/queryController");

// ✅ Normal API
router.post("/", queryDocs);

// ✅ Streaming API
router.post("/stream", queryDocsStream);

module.exports = router;