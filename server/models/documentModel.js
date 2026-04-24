const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    index: true
  },
  chunkText: {
    type: String,
    required: true,
  },

  // 🔥 Vector field
  embedding: {
    type: [Number],
    required: true,
  },

  // ✅ NEW FIELDS
  chunkIndex: {
    type: Number,
    required: true
  },
  pageNumber: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);