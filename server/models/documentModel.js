const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  chunkText: {
    type: String,
    required: true,
  },

  // 🔥 IMPORTANT: Vector field for MongoDB Atlas Search
  embedding: {
    type: [Number],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);