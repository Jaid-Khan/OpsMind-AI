const fs = require("fs");
const pdfParse = require("pdf-parse");
const { chunkText } = require("../utils/chunker");
const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");

const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = req.file.originalname;

    // ✅ Prevent duplicate upload
    const exists = await Document.findOne({ fileName });
    if (exists) {
      return res.status(400).json({ error: "File already exists" });
    }

    const filePath = req.file.path;

    const dataBuffer = await fs.promises.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Empty PDF content" });
    }

    const chunks = chunkText(text);

    const docs = [];

    // ✅ SAFE LOOP (NO CRASH)
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (!chunk || chunk.length < 50) continue;

      const embedding = await generateEmbedding(chunk);

      docs.push({
        fileName,
        chunkText: chunk,
        embedding,
        chunkIndex: i,
        pageNumber: Math.floor(i / 3) + 1
      });

      // ✅ Batch insert (prevents memory crash)
      if (docs.length === 50) {
        await Document.insertMany(docs);
        docs.length = 0;
      }
    }

    // Insert remaining
    if (docs.length > 0) {
      await Document.insertMany(docs);
    }

    res.status(200).json({
      message: "PDF processed & stored successfully",
      totalChunks: chunks.length
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadPDF };