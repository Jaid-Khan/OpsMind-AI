// Huggingface Embddings
// server/services/embeddingService.js

const { pipeline } = require("@xenova/transformers");

// Load model once (singleton)
let extractor;

async function loadModel() {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return extractor;
}

const generateEmbedding = async (text) => {
  try {
    const model = await loadModel();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert tensor → array
    return Array.from(output.data);

  } catch (error) {
    console.error("Embedding error:", error.message);
    return [];
  }
};

module.exports = { generateEmbedding };












// // Using Free Embeddings For Continue Project Developement Which Works Offline Only
// const generateEmbedding = async (text) => {
//   try {
//     // ✅ Lightweight stable embedding
//     return Array.from({ length: 384 }, () => Math.random());
//   } catch (error) {
//     console.error("Embedding error:", error.message);
//     return [];
//   }
// };

// module.exports = { generateEmbedding };

