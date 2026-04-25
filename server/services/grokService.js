const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 STREAMING FUNCTION
const generateAnswerStream = async (context, query, res) => {
  try {
    const prompt = `
You are OpsMind AI — an enterprise SOP assistant.

STRICT RULES:
1. Answer ONLY using the provided context
2. DO NOT say "I don't have" or "I infer"
3. DO NOT explain limitations
4. Give a direct, confident answer
5. Always cite like:
   According to [File: <fileName>, Page: <pageNumber>]

If answer is not found, say EXACTLY:
"I don't know based on the provided documents."

---------------------

CONTEXT:
${context}

---------------------

QUESTION:
${query}

---------------------

FINAL ANSWER:
`;

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a strict enterprise AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      stream: true,
    });

    // 🔥 Token streaming
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) {
        res.write(token);
      }
    }

    res.end();
  } catch (error) {
    console.error("Streaming ERROR:", error);
    res.write("\n[Error generating response]");
    res.end();
  }
};

module.exports = { generateAnswerStream };
