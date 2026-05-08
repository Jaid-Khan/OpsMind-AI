const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🔥 STREAMING FUNCTION
const generateAnswerStream = async (context, query, res) => {
  try {

    const prompt = `
You are OpsMind AI — a professional enterprise RAG assistant.

YOUR JOB:
Answer employee questions using ONLY the provided document context.

====================================
STRICT RULES:
====================================

1. ONLY use information from DOCUMENT CONTEXT
2. NEVER hallucinate or invent information
3. NEVER repeat the same point multiple times
4. Merge similar information into one clean response
5. Write concise and professional answers
6. Avoid phrases like:
   - "According to..."
   - "Based on the provided context..."
   - "The document states..."
7. DO NOT mention every chunk separately
8. DO NOT expose internal chunk formatting
9. Use natural language summaries
10. Keep answers readable and structured

====================================
SOURCE RULES:
====================================

- At the END of the answer write:

Sources:
- fileName (Page X)

- Do NOT repeat sources multiple times
- Combine duplicate citations

====================================
UNKNOWN ANSWER RULE:
====================================

If the answer does not exist in context, reply EXACTLY:

"I don't know based on the provided documents."

====================================
DOCUMENT CONTEXT:
====================================

${context}

====================================
USER QUESTION:
====================================

${query}

====================================
FINAL ANSWER:
====================================
`;

    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        {
          role: "system",
          content:
            "You are a professional enterprise AI assistant that gives concise, non-repetitive answers.",
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

    // 🔥 STREAM TOKENS
    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content;

      if (token) {
        res.write(token);
      }
    }

    res.end();

  } catch (error) {
    console.error("Streaming ERROR:", error);

    res.write("Error generating response");
    res.end();
  }
};

// 🔥 NORMAL NON-STREAM FUNCTION
const generateAnswer = async (context, query) => {
  try {

    let fullResponse = "";

    // Fake response object
    const fakeRes = {
      write: (chunk) => {
        fullResponse += chunk;
      },

      end: () => {},
    };

    await generateAnswerStream(context, query, fakeRes);

    return fullResponse;

  } catch (error) {
    console.error("Generate Answer Error:", error);

    return "Error generating response";
  }
};

module.exports = {
  generateAnswerStream,
  generateAnswer,
};