const mongoose = require("mongoose");

const documentSchema =
  new mongoose.Schema({
    // Original file name
    fileName: {
      type: String,
      required: true,
      index: true,
    },

    // Actual uploaded file
    storedFileName: {
      type: String,
      required: true,
    },

    chunkText: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    pageNumber: {
      type: Number,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports =
  mongoose.model(
    "Document",
    documentSchema
  );