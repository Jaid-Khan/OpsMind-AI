// Using MOCK Embeddings 

const generateEmbedding = async (text) => {
  try {
    // 🔥 Fake embedding (random vector)
    const vector = Array.from({ length: 384 }, () => Math.random());

    return vector;

  } catch (error) {
    console.error("Embedding error:", error.message);
    return [];
  }
};

module.exports = { generateEmbedding };


// Gemini Api Embedding Not Working
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const generateEmbedding = async (text) => {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "text-embedding-004"
//     });

//     const result = await model.embedContent(text);

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




