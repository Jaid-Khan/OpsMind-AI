const cleanText = (text) => {
  return text
    .replace(/\n+/g, " ")
    .replace(/||||||||易||/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

exports.chunkText = (text) => {
  const cleaned = cleanText(text);

  const chunkSize = 1000;
  const overlap = 150;

  let chunks = [];

  for (let i = 0; i < cleaned.length; i += (chunkSize - overlap)) {
    const chunk = cleaned.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
};