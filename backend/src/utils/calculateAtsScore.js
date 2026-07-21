function calculateAtsScore(extractedData, formattingResult) {
  const requiredSkills = extractedData.requiredSkills || [];
  const matchedSkills = extractedData.matchedSkills || [];
  const keywordsFound = extractedData.keywordsFound || [];
  const keywordsRequired = extractedData.keywordsRequired || [];

  const skillsScore =
    requiredSkills.length > 0
      ? Math.min((matchedSkills.length / requiredSkills.length) * 40, 40)
      : 40;

  const experienceScore = Math.min(
    (extractedData.candidateYearsExperience /
      (extractedData.requiredYearsExperience || 1)) *
      25,
    25,
  );

  const projectsScore = Math.min(
    ((extractedData.relevantProjectsCount || 0) / 3) * 20,
    20,
  );

  const keywordsScore =
    keywordsRequired.length > 0
      ? Math.min((keywordsFound.length / keywordsRequired.length) * 10, 10)
      : 10;

  const educationScore = extractedData.educationMatch ? 5 : 0;

  const breakdown = {
    skillsMatch: { score: round1(skillsScore), max: 40 },
    experienceMatch: { score: round1(experienceScore), max: 25 },
    projectsMatch: { score: round1(projectsScore), max: 20 },
    keywordsMatch: { score: round1(keywordsScore), max: 10 },
    education: { score: educationScore, max: 5 },
  };

  const rawTotal =
    skillsScore +
    experienceScore +
    projectsScore +
    keywordsScore +
    educationScore;
  const total = Math.round(rawTotal * 0.9 + formattingResult.score * 1.0);

  return {
    total: Math.min(Math.max(total, 0), 100),

    breakdown,

    formattingScore: {
      score: formattingResult.score,
      max: 10,
      issues: formattingResult.issues,
    },

    tier: getTier(total),

    missingKeywords: extractedData.missingSkills || [],

    strengths: extractedData.strengths || [],

    version: 1,
    previousVersions: null,
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

module.exports = calculateAtsScore;
