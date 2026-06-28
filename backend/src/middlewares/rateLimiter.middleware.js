const configRateLimiter = require("../config/rateLimiter.config");
const { getClientIP, toManyRequest } = require("../utils/helpers/rateLimit.helper");
const hashKey = require("../utils/hash.utils");

const loginRateLimiter = async (req, res, next) => {
  const ip = getClientIP(req);
  const rawEmail = (req.body?.email || "unknown_user").toLowerCase().trim();
  const userKey = hashKey.hashKey(rawEmail);
  try {
    // Consume points for IP
    await configRateLimiter.loginByIP.consume(ip);

    // Consume points for User
    await configRateLimiter.loginByUser.consume(userKey);

    return next();
  } catch (err) {
    if (err instanceof Error) {
      console.error("[RateLimit] Redis/system error on login:", err);

      return res.status(503).json({
        success: false,
        message:
          "Authentication service temporarily unavailable. Please try again shortly.",
      });
    }

    return toManyRequest(
      res,
      err,
      "Too many login attempts. Please try again later.",
    );
  }
};

const registerRateLimiter = async (req, res, next) => {
  const ip = getClientIP(req);
  try {
    await configRateLimiter.registerByIP.consume(ip);
    return next();
  } catch (err) {
    if (err instanceof Error) {
      console.error("[RateLimit] Redis/system error on register:", err);
      return res.status(503).json({
        success: false,
        message: "Registration service temporarily unavailable. Please try again shortly.",
      });
    }


    return toManyRequest(
      res,
      err,
      "Too many registration attempts. Try again later."
    );
  }
};

const globalAPIRateLimiter = async (req, res, next) => {
  const ip = getClientIP(req);

  try {
    await configRateLimiter.globalAPIByIP.consume(ip);
    next();
  } catch (err) {
    if (err instanceof Error) {
      console.error("[RateLimit] Redis/system error on global API:", err);
      // Fail-open: degraded protection is acceptable here
      return next();
    }

    return toManyRequest(
      res,
      err,
      "Too many requests. Try again later."
    );
  }
};

const passwordResetRateLimiter = async (req, res, next) => {
  try {
    const ip = getClientIP(req);
    await configRateLimiter.passwordReset.consume(ip);
    next();
  }catch (err) {
    return res.status(429).json({
      success: false,
      message: "Too many password reset attempts. Try again after 1 hour.",
    });
  }
}

const emailVerificationRateLimiter = async (req, res, next) => {
  try {
    await configRateLimiter.emailVerification.consume(req.ip);
    next();
  } catch (err) {
    return res.status(429).json({
      success: false,
      message: "Too many email verification requests. Try again after 1 hour.",
    });
  }
}

const twoFactorRateLimiter = async (req, res, next) => {
  try {
    await configRateLimiter.twoFactor.consume(req.ip);
    next();
  } catch (err) {
    return res.status(429).json({
      success: false,
      message: "Too many 2FA attempts. Try again later.",
    });
  }
}

const chatRoomCreateRateLimiter = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required for rate limiting.",
    });
  }

  try {
    await configRateLimiter.chatRoomCreateLimiter.consume(userId);
    next();
  } catch (err) {
     if (err instanceof Error) {
      console.error("[RateLimit] chat room create error:", err.message);
      return res.status(503).json({ 
        success: false, 
        message: "Service unavailable." 
      });
    }
    
    return toManyRequest(res, err, "Too many chat room creation attempts. Try again later.");
  }
}

module.exports = {
  loginRateLimiter,
  registerRateLimiter,
  globalAPIRateLimiter,
  passwordResetRateLimiter,
  emailVerificationRateLimiter,
  twoFactorRateLimiter,
  chatRoomCreateRateLimiter,
};
