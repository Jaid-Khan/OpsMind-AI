const express = require("express");
const router = express.Router();

const { getAllDocs, deleteDoc } = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");

// 🔥 Admin APIs
// router.get("/docs", getAllDocs);
// router.delete("/docs/:fileName", deleteDoc);

router.get("/docs", protect, getAllDocs);

router.delete("/docs/:fileName", protect, deleteDoc);

module.exports = router;
