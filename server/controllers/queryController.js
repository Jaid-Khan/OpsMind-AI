const Document = require("../models/documentModel");

const {
  generateEmbedding,
} = require("../services/embeddingService");

const {
  generateAnswer,
  generateAnswerStream,
} = require("../services/grokService");

// ======================================================
// GET SOURCE PREVIEW
// ======================================================

exports.getSourcePreview = async (req, res) => {
  try {

    const {
      fileName,
      pageNumber,
    } = req.query;

    if (!fileName || !pageNumber) {
      return res.status(400).json({
        error: "Missing source params",
      });
    }

    const doc = await Document.findOne({
      fileName,
      pageNumber,
    });

    if (!doc) {
      return res.status(404).json({
        error: "Source not found",
      });
    }

    return res.json({
      fileName: doc.fileName,
      pageNumber: doc.pageNumber,
      chunkText: doc.chunkText,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to load source",
    });
  }
};

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

    const queryEmbedding =
      await generateEmbedding(query);

    const results =
      await Document.aggregate([
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
            score: {
              $meta:
                "vectorSearchScore",
            },
          },
        },
      ]);

    const filtered =
      results.filter(
        (doc) => doc.score > 0.72
      );

    if (!filtered.length) {
      return res.json({
        answer:
          "I don't know based on the provided documents.",
        sources: [],
      });
    }

    const sources = filtered.map(
      (doc) => ({
        fileName: doc.fileName,
        pageNumber:
          doc.pageNumber,
      })
    );

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

    const formattedHistory =
      history
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

    const answer =
      await generateAnswer(
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

exports.queryDocsStream =
  async (req, res) => {
    try {

      const {
        query,
        history = [],
      } = req.body;

      if (!query) {
        return res.status(400).json({
          error:
            "Query is required",
        });
      }

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

      const queryEmbedding =
        await generateEmbedding(
          query
        );

      const results =
        await Document.aggregate([
          {
            $vectorSearch: {
              index:
                "vector_index",
              path: "embedding",
              queryVector:
                queryEmbedding,
              numCandidates: 200,
              limit: 5,
            },
          },
          {
            $addFields: {
              score: {
                $meta:
                  "vectorSearchScore",
              },
            },
          },
        ]);

      const filtered =
        results.filter(
          (doc) =>
            doc.score > 0.55
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

      const sources =
        filtered.map((doc) => ({
          fileName:
            doc.fileName,
          pageNumber:
            doc.pageNumber,
        }));

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

      const formattedHistory =
        history
          .slice(-5)
          .map((msg) =>
            msg.type ===
            "user"
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
                sources,
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
          error:
            "Streaming failed",
        })}\n\n`
      );

      res.end();
    }
  };