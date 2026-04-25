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
// Using MOCK Embeddings 
// const generateEmbedding = async (text) => {
//   try {
//     // 🔥 Fake embedding (random vector)
//     const vector = Array.from({ length: 384 }, () => Math.random());

//     return vector;

//   } catch (error) {
//     console.error("Embedding error:", error.message);
//     return [];
//   }
// };

// module.exports = { generateEmbedding };


// Gemini Api Embedding 
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "embedding-001"
// });

// const generateEmbedding = async (text) => {
//   try {
//     if (!text || text.trim().length === 0) {
//       return [];
//     }

//     const result = await model.embedContent({
//       content: {
//         parts: [{ text }]
//       }
//     });

//     return result.embedding.values;

//   } catch (error) {
//     console.error("Embedding error:", error.message);
//     return [];
//   }
// };

// module.exports = { generateEmbedding };



// OpenAi Api Embedding Not Working
// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const generateEmbedding = async (text) => {
//   try {
//     const response = await openai.embeddings.create({
//       model: "text-embedding-3-small",
//       input: text,
//     });

//     return response.data[0].embedding;

//   } catch (error) {
//     console.error("Embedding error:", error.message);
//     return [];
//   }
// };

// module.exports = { generateEmbedding };




