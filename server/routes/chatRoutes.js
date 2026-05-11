const express = require("express");

const router = express.Router();

const {
  getChat,
  saveMessage,
} = require("../controllers/chatController");


// ✅ GET CHAT
router.get("/:sessionId", getChat);


// ✅ SAVE MESSAGE
router.post("/save", saveMessage);

module.exports = router;