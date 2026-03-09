function extractText(chunk) {
  if (!chunk || !chunk.candidates || chunk.candidates.length === 0) {
    return "";
  }

  const candidate = chunk.candidates[0];

  if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
    return "";
  }

  return candidate.content.parts[0].text || "";
}

module.exports = { extractText };