const express = require("express");
const router = express.Router();
const { queryDocs } = require("../controllers/queryController");

router.post("/", queryDocs);

module.exports = router;