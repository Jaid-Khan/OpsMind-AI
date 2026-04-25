const Document = require("../models/documentModel");
const { generateEmbedding } = require("../services/embeddingService");
const { generateAnswerStream } = require("../services/grokService");

exports.queryDocs = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 🔥 Streaming headers
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // 🔥 Improve query for better embedding
    const improvedQuery = `Explain clearly: ${query}`;

    // 1️⃣ Generate embedding
    const queryEmbedding = await generateEmbedding(improvedQuery);

    // 2️⃣ Vector search with score
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "default",
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

    // 🔍 DEBUG (remove later)
    console.log(
      results.slice(0, 3).map((r) => ({
        score: r.score,
        text: r.chunkText.slice(0, 80),
      })),
    );

    // 3️⃣ Filter weak results
    const filtered = results.filter((doc) => doc.score > 0.35);

    // 4️⃣ Fallback if no strong match
    if (!filtered.length) {
      console.log("⚠️ No strong vector match, using fallback...");

      const fallbackDocs = await Document.find().limit(3);

      if (!fallbackDocs.length) {
        res.write("No documents available");
        return res.end();
      }

      const fallbackContext = fallbackDocs
        .map(
          (doc, i) => `
[Fallback Source ${i + 1}]
File: ${doc.fileName}
Page: ${doc.pageNumber}

${doc.chunkText}
`,
        )
        .join("\n\n");

      return await generateAnswerStream(fallbackContext, query, res);
    }

    // 5️⃣ Build context
    const context = filtered
      .map(
        (doc, i) => `
SOURCE ${i + 1}:
File: ${doc.fileName}
Page: ${doc.pageNumber}

Content:
${doc.chunkText}
-------------------
`,
      )
      .join("\n\n");
    // 6️⃣ Stream answer
    await generateAnswerStream(context, query, res);
  } catch (error) {
    console.error(error);
    res.write("\nQuery failed");
    res.end();
  }
};
