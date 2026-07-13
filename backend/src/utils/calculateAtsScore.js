function calculateAtsScore(extractedData, formattingResult) {
  const skillsScore =
    extractedData.requiredSkills.length > 0
      ? (extractedData.matchedSkills.length / extractedData.requiredSkills.length) * 40
      : 40;

  const experienceScore = Math.min(
    (extractedData.candidateYearsExperience / (extractedData.requiredYearsExperience || 1)) * 25,
    25,
  );

  const projectsScore = Math.min((extractedData.relevantProjectsCount / 3) * 20, 20);

  const keywordsScore =
    extractedData.keywordsRequired.length > 0
      ? (extractedData.keywordsFound.length / extractedData.keywordsRequired.length) * 10
      : 10;

  const educationScore = extractedData.educationMatch ? 5 : 0;

  const breakdown = {
    skillsMatch: { score: round1(skillsScore), max: 40 },
    experienceMatch: { score: round1(experienceScore), max: 25 },
    projectsMatch: { score: round1(projectsScore), max: 20 },
    keywordsMatch: { score: round1(keywordsScore), max: 10 },
    education: { score: educationScore, max: 5 },
  };

  const rawTotal = skillsScore + experienceScore + projectsScore + keywordsScore + educationScore;
  const total = Math.round(rawTotal * 0.9 + formattingResult.score * 1.0);

  return {
    total: Math.min(total, 100),
    breakdown,
    tier: getTier(total),
  };
}

function getTier(score) {
  if (score < 50) return "Poor";
  if (score < 70) return "Average";
  if (score < 85) return "Good";
  return "Excellent";
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

module.exports = { calculateAtsScore };