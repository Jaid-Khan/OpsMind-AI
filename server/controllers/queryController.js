const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/grokService");

// 🔥 Cosine Similarity
const cosineSimilarity = (a, b) => {
  if (!a.length || !b.length) return 0;

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dot / (magA * magB);
};

exports.queryDocs = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1️⃣ Query → embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2️⃣ Get documents
    const docs = await Document.find().limit(500);

    if (!docs.length) {
      return res.json({ answer: "No documents found" });
    }

    // 3️⃣ Similarity scoring
    const scoredDocs = docs.map(doc => ({
      text: doc.chunkText,
      fileName: doc.fileName,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // 4️⃣ Top results
    const topDocs = scoredDocs
      .filter(d => d.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (!topDocs.length) {
      return res.json({ answer: "No relevant results found" });
    }

    // 5️⃣ Create context
    const context = topDocs.map(d => d.text).join("\n\n");

    // 🔥 6️⃣ LLM Answer (Groq)
    const answer = await generateAnswer(context, query);

    // 7️⃣ Response
    res.json({
      answer,
      sources: topDocs.map(d => d.fileName)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Query failed" });
  }
};