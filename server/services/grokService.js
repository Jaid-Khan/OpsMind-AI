const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAnswer = async (context, query) => {
  try {
    const safeContext = context.split(" ").slice(0, 500).join(" ");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ UPDATED MODEL
      messages: [
        {
          role: "system",
          content:
            "Answer ONLY from the provided context. If answer is not found, say 'Not found in document'.",
        },
        {
          role: "user",
          content: `Context:\n${safeContext}\n\nQuestion:\n${query}`,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Groq ERROR:", error);
    return "LLM failed";
  }
};

module.exports = { generateAnswer };