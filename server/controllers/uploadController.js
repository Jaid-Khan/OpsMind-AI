const fs = require("fs");
const pdfParse = require("pdf-parse");
const { chunkText } = require("../utils/chunker");
const Document = require("../models/documentModel");
// console.log(typeof pdfParse)


const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    const dataBuffer = await fs.promises.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;

    const chunks = chunkText(text);

    const docs = chunks.map(chunk => ({
      fileName: req.file.originalname,
      chunkText: chunk,
      embedding: []
    }));

    await Document.insertMany(docs);

    res.status(200).json({
      message: "PDF processed & stored",
      totalChunks: chunks.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadPDF };