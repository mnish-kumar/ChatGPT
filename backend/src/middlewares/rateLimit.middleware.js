const service = require("../services/rate.limiter");

async function rateLimitMiddleware(req, res, next) {
  try {
    const userId = `rate${req.user._id}`; // Assuming req.user is set after authentication

    const result = await service.attempt(userId);

    if (!result.allowed) {
      return res.status(429).json({
        message: "Too many requests",
        retryAfter: result.retryAfter,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  rateLimitMiddleware,
};
