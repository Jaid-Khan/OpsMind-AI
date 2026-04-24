const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAnswer = async (context, query) => {
  try {
    const prompt = `
You are OpsMind AI — an enterprise SOP assistant.

Your job:
Answer employee questions strictly using the provided SOP context.

---------------------
RULES (VERY IMPORTANT):

1. Use ONLY the given context
2. DO NOT make up information
3. If answer is missing, respond EXACTLY:
   "I don't know based on the provided documents."

4. ALWAYS provide citations in this format:
   "According to [File: <fileName>, Page: <pageNumber>]"

5. Keep answers:
   - Clear
   - Professional
   - Step-by-step if needed

---------------------

CONTEXT:
${context}

---------------------

QUESTION:
${query}

---------------------

FINAL ANSWER:
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a strict enterprise assistant that never hallucinates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error("Groq ERROR:", error);
    return "LLM failed to generate response";
  }
};

module.exports = { generateAnswer };