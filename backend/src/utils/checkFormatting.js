function checkFormatting(pdfParseResult) {
  const issues = [];
  let score = 10;

  const text = pdfParseResult.text || "";

  if (text.trim().length < 100) {
    issues.push({
      issue: "Resume appears to be a scanned image, not readable text.",
      severity: "High",
    });
    score -= 4;
  }

  const standardHeadings = ["experience", "education", "skills", "projects"];
  const foundHeadings = standardHeadings.filter((h) =>
    text.toLowerCase().includes(h),
  );
  if (foundHeadings.length < 3) {
    issues.push({
      issue: "Missing standard section headings (Experience/Education/Skills).",
      severity: "Medium",
    });
    score -= 2;
  }

  const weirdCharRatio =
    text.length > 0
      ? (text.match(/[^\x00-\x7F]/g) || []).length / text.length
      : 0;
  if (weirdCharRatio > 0.02) {
    issues.push({
      issue: "Unusual characters/icons detected — may confuse ATS parsers.",
      severity: "Low",
    });
    score -= 1;
  }

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text.slice(0, 300));
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\d{10}/.test(text.slice(0, 300));
  if (!hasEmail && !hasPhone) {
    issues.push({
      issue: "Contact info not detected near top of resume.",
      severity: "Medium",
    });
    score -= 1;
  }

  return { score: Math.max(score, 0), issues };
}

module.exports = checkFormatting;
