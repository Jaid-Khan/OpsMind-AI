const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/grokService");

exports.queryDocs = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1️⃣ Query embedding
    const queryEmbedding = await generateEmbedding(query);

    // 🔥 2️⃣ MongoDB Vector Search (PRODUCTION)
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "default",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5
        }
      }
    ]);

    if (!results.length) {
      return res.json({ answer: "No relevant results found" });
    }

    // 🔥 3️⃣ Smart context with citation
    const context = results.map((doc, i) => `
[Source ${i + 1}]
File: ${doc.fileName}
Page: ${doc.pageNumber}

${doc.chunkText}
`).join("\n\n");

    // 🔥 4️⃣ LLM Answer
    const answer = await generateAnswer(context, query);

    // 5️⃣ Structured response
    res.json({
      answer,
      sources: results.map(doc => ({
        file: doc.fileName,
        page: doc.pageNumber
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Query failed" });
  }
};