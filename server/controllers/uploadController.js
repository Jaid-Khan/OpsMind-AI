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

    const chunks = chunkText(text);

    // ✅ Parallel embedding (FAST)
    const docs = await Promise.all(
      chunks.map(async (chunk, i) => ({
        fileName,
        chunkText: chunk,
        embedding: await generateEmbedding(chunk),
        chunkIndex: i,
        pageNumber: Math.floor(i / 3) + 1 // approx mapping
      }))
    );

    await Document.insertMany(docs);

    res.status(200).json({
      message: "PDF processed & stored",
      totalChunks: chunks.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadPDF };