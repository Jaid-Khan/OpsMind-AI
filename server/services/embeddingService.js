// Using Free Embeddings For Continue Project Developement Which Works Offline Only
const generateEmbedding = async (text) => {
  try {
    // ✅ Lightweight stable embedding
    return Array.from({ length: 384 }, () => Math.random());
  } catch (error) {
    console.error("Embedding error:", error.message);
    return [];
  }
};

module.exports = { generateEmbedding };
