const { redisClient } = require("../config/redis");
const hashUtils = require("../utils/hash.utils");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

async function setRefreshToken(
  userId,
  refreshToken,
  req,
  sessionId = uuidv4(),
) {
  const key = `refreshToken:${userId}:${sessionId}`;
  const hashedToken = hashUtils.hashToken(refreshToken);
  
    // Support a short grace window for refresh-token rotation.
    // This prevents concurrent refresh calls (e.g., during page load) from
    // immediately invalidating the previous token.
    let previousToken = null;
    let previousTokenExpiresAt = null;
    try {
        const existing = await redisClient.get(key);
        if (existing) {
            const parsedExisting = JSON.parse(existing);
            if (parsedExisting?.token) {
                previousToken = parsedExisting.token;
                previousTokenExpiresAt = Date.now() + 60 * 1000; // 60s grace
            }
        }
    } catch (_) {
        // Ignore parsing/redis read issues and proceed with overwriting.
    }

  const value = JSON.stringify({
    token: hashedToken,
      previousToken,
      previousTokenExpiresAt,
    sessionId,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    createdAt: Date.now(),
  });

  await redisClient.set(key, value, "EX", 7 * 24 * 60 * 60); // 7 days expiration

  return {
    sessionId,
    key,
  };
}

async function verifyRefreshToken(refreshToken, userId, sessionId) {
  try {
    // Verify jwt signature and expiration
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded || !decoded.id) {
      throw new Error("Invalid refresh payload");
    }

    if (decoded?.id?.toString() !== userId?.toString()) {
      throw new Error("Refresh token user mismatch");
    }

    const key = `refreshToken:${userId}:${sessionId}`;
    const storedRefreshToken = await redisClient.get(key);

    if (!storedRefreshToken) {
      throw new Error("Refresh token not found in redis - session may have expired or been cleared");
    }

    // Compare hashed tokens
    const parsed = JSON.parse(storedRefreshToken);
    const hashedToken = hashUtils.hashToken(refreshToken);

    // Check current token
    if (parsed.token === hashedToken) {
      return decoded;
    }

    // Check previous token during grace period (60 seconds)
    if (parsed.previousToken && parsed.previousTokenExpiresAt) {
      if (Date.now() < parsed.previousTokenExpiresAt && parsed.previousToken === hashedToken) {
        console.log("Token rotation grace period: Using previous token");
        return decoded;
      }
    }

    console.error("Token mismatch - Expected hash does not match stored hash");
    throw new Error("Invalid refresh token - token does not match stored value");
  } catch (error) {
    console.error("verifyRefreshToken failed:", error.message);
    throw error;
  }
}

async function deleteRefreshToken(userId, sessionId) {
  const key = `refreshToken:${userId}:${sessionId}`;
  await redisClient.del(key);
}

async function passwordResetTokenSet(userId) {
  const resetToken = hashUtils.generateVerificationToken();
  const hashedToken = hashUtils.hashToken(resetToken);

  const key = `passwordReset:${userId}`;
  await redisClient.set(key, hashedToken, "EX", 15 * 60);

  return resetToken;
}

module.exports = {
  setRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
  passwordResetTokenSet,
};
