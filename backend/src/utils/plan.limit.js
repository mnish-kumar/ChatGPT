const PLAN_LIMITS = {
  FREE: {
    maxInputTokens: 50000,
    maxOutputTokens: 4000,
  },

  PRO: {
    maxInputTokens: 1000000,
    maxOutputTokens: 65000,
  },
};

module.exports = PLAN_LIMITS;