export function cleanAnswer(text) {
  if (!text) return "";

  return text
    // ❌ Remove: According to [File: ..., Page: X]
    .replace(/According to\s*\[File:.*?Page:\s*\d+\]/gi, "")

    // ❌ Remove: According to File: ..., Page: X
    .replace(/According to File:.*?Page:\s*\d+/gi, "")

    // ❌ Remove: [File: ..., Page: X]
    .replace(/\[File:.*?Page:\s*\d+\]/gi, "")

    // ❌ Remove standalone "According to"
    .replace(/According to/gi, "")

    // ❌ Remove weird symbols (from PDFs)
    .replace(/||||||||易||/g, "")

    // ✅ Clean formatting
    .replace(/\n\s*\n/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}