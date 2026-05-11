const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    sources: [
      {
        fileName: String,
        pageNumber: Number,
      },
    ],
  },
  {
    _id: false,
  }
);

const chatSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);