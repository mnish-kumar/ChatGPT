const PLAN_LIMITS = require("./plan.limit");
const estimateTokens = require("./token.estimator");

function validateTokenLimit(userPlan, input) {

  const inputTokens = estimateTokens(input);

  const limits = PLAN_LIMITS[userPlan];

  if (inputTokens > limits.maxInputTokens) {
    throw new Error("Input token limit exceeded");
  }

  return limits;
}

module.exports = validateTokenLimit;