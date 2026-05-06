// utils/extractJobRole.js
const extractJobRole = (jobDescription) => {
  const firstLine = jobDescription?.split("\n")[0] ?? "";

  const beforePipe = firstLine.split("|")[0].trim();
  
  const cleaned = beforePipe.replace(/\(.*?\)/g, "").trim();
  
  const words = cleaned.split(" ").slice(0, 3).join(" ");
  
  return words || "Software Developer";
};

module.exports = extractJobRole;