export function cleanAnswer(text) {
  if (!text) return "";

  return text
    // ❌ Remove weird symbols (PDF garbage)
    .replace(/||||||||易||/g, "")

    // ✅ Keep citations but clean spacing
    .replace(/\n\s*\n/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}