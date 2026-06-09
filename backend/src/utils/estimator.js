function estimateTokens(messages) {
  const text = messages
    .map((msg) => JSON.stringify(msg))
    .join(" ");

  return Math.ceil(text.length / 4);
}

module.exports = estimateTokens;