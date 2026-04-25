const express = require("express");
const router = express.Router();

const {
  getAllDocs,
  deleteDoc
} = require("../controllers/adminController");

// 🔥 Admin APIs
router.get("/docs", getAllDocs);
router.delete("/docs/:fileName", deleteDoc);

module.exports = router;