const simpleAnswer = (context, query) => {
  if (!context) return "No context available";

  const cleaned = cleanText(context);

  const sentences = cleaned.split(". ").filter(s => s.length > 20);

  const keywords = query.toLowerCase().split(" ");

  const scored = sentences.map(sentence => {
    let score = 0;

    keywords.forEach(word => {
      if (sentence.toLowerCase().includes(word)) {
        score += 2; // boost match weight
      }
    });

    return { sentence, score };
  });

  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.sentence);

  if (top.length === 0) {
    return cleaned.substring(0, 500);
  }

  return top.join(". ") + ".";
};