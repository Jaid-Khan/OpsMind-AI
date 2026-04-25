const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/grokService");

exports.queryDocs = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 🔥 Improve query
    const improvedQuery = `Explain clearly: ${query}`;

    // 1️⃣ Generate embedding
    const queryEmbedding = await generateEmbedding(improvedQuery);

    // 2️⃣ Vector search
const results = await Document.aggregate([
  {
    $vectorSearch: {
      index: "vector_index", // ✅ FIXED
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10,
    },
  },
  {
    $addFields: {
      score: { $meta: "vectorSearchScore" },
    },
  },
]);

    // 🔥 DEBUG (optional - remove later)
    console.log("VECTOR SCORES:");
    results.slice(0, 5).forEach(r => {
      console.log({
        score: r.score,
        fileName: r.fileName,
        pageNumber: r.pageNumber
      });
    });

    // 3️⃣ PROPER RAG RETRIEVAL (FIXED)
    const filtered = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    let context = "";
    let sources = [];

    // 4️⃣ Check if no results
    if (!filtered.length) {
      console.log("⚠️ No results found, using fallback...");

      const fallbackDocs = await Document.find().limit(3);

      if (!fallbackDocs.length) {
        return res.json({ answer: "No documents available", sources: [] });
      }

      sources = fallbackDocs.map((doc) => ({
        fileName: doc.fileName,
        pageNumber: doc.pageNumber,
      }));

      context = fallbackDocs
        .map(
          (doc, i) => `
[Fallback Source ${i + 1}]
File: ${doc.fileName}
Page: ${doc.pageNumber}

${doc.chunkText}
`
        )
        .join("\n\n");

    } else {

      sources = filtered.map((doc) => ({
        fileName: doc.fileName,
        pageNumber: doc.pageNumber,
      }));

      context = filtered
        .map(
          (doc, i) => `
SOURCE ${i + 1}:
File: ${doc.fileName}
Page: ${doc.pageNumber}

Content:
${doc.chunkText}
-------------------
`
        )
        .join("\n\n");
    }

    // 5️⃣ Generate answer
    let answer;

    try {
      answer = await generateAnswer(context, query);
    } catch (err) {
      console.log("⚠️ LLM failed, using simpleAnswer...");
      const { simpleAnswer } = require("../services/simpleAnswerService");
      answer = simpleAnswer(context, query);
    }

    // ✅ FINAL RESPONSE
    return res.json({ answer, sources });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Query failed" });
  }
};