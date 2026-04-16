const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");

// 🔥 Cosine Similarity Function
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

    // ✅ 1. Convert query → embedding
    const queryEmbedding = await generateEmbedding(query);

    // ✅ 2. Fetch documents
    const docs = await Document.find();

    if (!docs.length) {
      return res.json({ answer: "No documents found" });
    }

    // ✅ 3. Calculate similarity
    const scoredDocs = docs.map(doc => ({
      text: doc.chunkText,
      score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // ✅ 4. Get top 3 relevant chunks
    const topDocs = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // ✅ 5. Create context
    const context = topDocs.map(d => d.text).join("\n\n");

    // 🔥 6. (TEMP AI RESPONSE — replace with Gemini next)
    const answer = `
Based on the document:

${context.substring(0, 500)}...
`;

    // ✅ 7. Return response
    res.json({
      answer,
      topMatches: topDocs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Query failed" });
  }
};