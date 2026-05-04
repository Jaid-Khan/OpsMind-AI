const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswer } = require("../services/grokService");

exports.queryDocs = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

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
          index: "vector_index",
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

    // 3️⃣ Filter top results
    const filtered = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    let context = "";
    let sources = [];

    if (!filtered.length) {
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

    // 🧠 NEW: FORMAT CHAT HISTORY
    const formattedHistory = history
      .slice(-5) // last 5 messages only
      .map(msg => {
        if (msg.type === "user") {
          return `User: ${msg.text}`;
        } else {
          return `Assistant: ${msg.text}`;
        }
      })
      .join("\n");

    // 🧠 FINAL CONTEXT WITH MEMORY
    const finalContext = `
CHAT HISTORY:
${formattedHistory}

---------------------

DOCUMENT CONTEXT:
${context}
`;

    // 5️⃣ Generate answer
    let answer;

    try {
      answer = await generateAnswer(finalContext, query);
    } catch (err) {
      console.log("⚠️ LLM failed, using simpleAnswer...");
      const { simpleAnswer } = require("../services/simpleAnswerService");
      answer = simpleAnswer(finalContext, query);
    }

    return res.json({ answer, sources });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Query failed" });
  }
};