const Document = require("../models/documentModel");

const {
  generateEmbedding,
} = require("../services/embeddingService");

const {
  generateAnswer,
  generateAnswerStream,
} = require("../services/grokService");

// ======================================================
// NORMAL RESPONSE
// ======================================================

exports.queryDocs = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    // ✅ Generate embedding
    const queryEmbedding = await generateEmbedding(query);

    // ✅ Vector search
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 200,
          limit: 5,
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    // ✅ Hallucination filter
    const filtered = results.filter(
      (doc) => doc.score > 0.72
    );

    if (!filtered.length) {
      return res.json({
        answer:
          "I don't know based on the provided documents.",
        sources: [],
      });
    }

    // ✅ Sources
    const sources = filtered.map((doc) => ({
      fileName: doc.fileName,
      pageNumber: doc.pageNumber,
    }));

    // ✅ Context
    const context = filtered
      .map(
        (doc, i) => `
SOURCE ${i + 1}
File: ${doc.fileName}
Page: ${doc.pageNumber}

${doc.chunkText}
`
      )
      .join("\n\n");

    // ✅ Chat history
    const formattedHistory = history
      .slice(-5)
      .map((msg) =>
        msg.type === "user"
          ? `User: ${msg.text}`
          : `Assistant: ${msg.text}`
      )
      .join("\n");

    const finalContext = `
CHAT HISTORY:
${formattedHistory}

DOCUMENT CONTEXT:
${context}
`;

    // ✅ Generate final answer
    const answer = await generateAnswer(
      finalContext,
      query
    );

    return res.json({
      answer,
      sources,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Query failed",
    });
  }
};

// ======================================================
// STREAMING RESPONSE (SSE)
// ======================================================

exports.queryDocsStream = async (req, res) => {
  try {
    const { query, history = [] } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    // ✅ SSE HEADERS
    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    // ✅ Generate embedding
    const queryEmbedding = await generateEmbedding(
      query
    );

    // ✅ Vector search
    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 200,
          limit: 5,
        },
      },
      {
        $addFields: {
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    // ✅ Hallucination protection
    const filtered = results.filter(
      (doc) => doc.score > 0.55
    );

    if (!filtered.length) {
      res.write(
        `data: ${JSON.stringify({
          token:
            "I don't know based on the provided documents.",
        })}\n\n`
      );

      return res.end();
    }

    // ✅ Sources
    const sources = filtered.map((doc) => ({
      fileName: doc.fileName,
      pageNumber: doc.pageNumber,
    }));

    // ✅ Send sources
    res.write(
      `data: ${JSON.stringify({
        sources,
      })}\n\n`
    );

    // ✅ Context
    const context = filtered
      .map(
        (doc, i) => `
SOURCE ${i + 1}
File: ${doc.fileName}
Page: ${doc.pageNumber}

${doc.chunkText}
`
      )
      .join("\n\n");

    // ✅ Chat history
    const formattedHistory = history
      .slice(-5)
      .map((msg) =>
        msg.type === "user"
          ? `User: ${msg.text}`
          : `Assistant: ${msg.text}`
      )
      .join("\n");

    const finalContext = `
CHAT HISTORY:
${formattedHistory}

DOCUMENT CONTEXT:
${context}
`;

    // ✅ Stream answer
    await generateAnswerStream(
      finalContext,
      query,
      {
        write: (token) => {
          res.write(
            `data: ${JSON.stringify({
              token,
            })}\n\n`
          );
        },

        end: () => {
          res.write(
            `data: ${JSON.stringify({
              done: true,
            })}\n\n`
          );

          res.end();
        },
      }
    );

  } catch (error) {
    console.error(error);

    res.write(
      `data: ${JSON.stringify({
        error: "Streaming failed",
      })}\n\n`
    );

    res.end();
  }
};