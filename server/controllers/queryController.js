const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");

exports.queryDocs = async (req, res) => {
  try {
    const { query } = req.body;

    // 1. Convert query → embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Fetch all documents (for now)
    const docs = await Document.find();

    // 3. TEMP: return docs (we'll add vector search next)
    res.json({
      message: "Query received",
      totalDocs: docs.length,
      sample: docs[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Query failed" });
  }
};