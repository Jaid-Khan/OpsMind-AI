const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================================================
// STREAMING
// ======================================================

const generateAnswerStream = async (
  context,
  query,
  res
) => {
  try {
    const prompt = `
You are OpsMind AI.

STRICT RULES:

1. Use ONLY provided context
2. Never hallucinate
3. Be concise
4. Be professional
5. If answer unavailable say:
"I don't know based on the provided documents."

DOCUMENT CONTEXT:
${context}

QUESTION:
${query}
`;

    const stream =
      await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a professional RAG assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.1,
        max_tokens: 700,
        stream: true,
      });

    for await (const chunk of stream) {
      const token =
        chunk.choices?.[0]?.delta?.content;

      if (token) {
        res.write(token);
      }
    }

    res.end();

  } catch (error) {
    console.error(error);

    res.write("Error generating response");

    res.end();
  }
};

// ======================================================
// NORMAL RESPONSE
// ======================================================

const generateAnswer = async (
  context,
  query
) => {
  try {
    let fullResponse = "";

    const fakeRes = {
      write: (token) => {
        fullResponse += token;
      },

      end: () => {},
    };

    await generateAnswerStream(
      context,
      query,
      fakeRes
    );

    return fullResponse;

  } catch (error) {
    console.error(error);

    return "Error generating response";
  }
};

module.exports = {
  generateAnswer,
  generateAnswerStream,
};