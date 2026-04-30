const { getClientIP, toManyRequest } = require("../utils/helpers/rateLimit.helper");
const hashKey = require("../utils/hash.utils");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../config/redis")


/**
 * Login — per IP
 * 5 attempts per 15 min window; 1-hour block after exhaustion.
 * inmemoryBlockOnConsumed reduces Redis round-trips under a brute-force flood.
 */
const loginByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_ip",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 15,
  inMemoryBlockOnConsumed: 5,
  inMemoryBlockDuration: 60 * 30,
});


/**
 * Login — per user (hashed email)
 * Prevents distributed attacks targeting a single account from many IPs.
 */
const loginByUser = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_user",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 15,
  inMemoryBlockOnConsumed: 5,
  inMemoryBlockDuration: 60 * 30,
});


/**
 * Register — per IP
 * Tighter than the global limiter to prevent mass account creation.
 */
const registerByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "register_ip",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 15,
  inMemoryBlockOnConsumed: 5,
  inMemoryBlockDuration: 60 * 30,
});


/**
 * Global API — per IP
 * Loose general-purpose throttle for all routes.
 */
const globalAPIByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "global_api_ip",
  points: 100,
  duration: 60,
  inMemoryBlockOnConsumed: 100,
  inMemoryBlockDuration: 30,
});


/**
 * Password Reset — per user
 * Prevents abuse of password reset functionality.
 */
const passwordResetLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:password_reset",
  points: 5,
  duration: 60 * 60, 
  blockDuration: 60 * 60,
});


const emailVerificationLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:email_verification",
  points: 3,
  duration: 60 * 60, 
  blockDuration: 60 * 60,
})


const twoFactorLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl:2fa",
  points: 5,               
  duration: 60 * 10,       
  blockDuration: 60 * 30,
});

const loginRateLimiter = async (req, res, next) => {
  const ip = getClientIP(req);
  const rawEmail = (req.body?.email || "unknown_user").toLowerCase().trim();
  const userKey = hashKey.hashKey(rawEmail);
  try {
    // Consume points for IP
    await loginByIP.consume(ip);

    // Consume points for User
    await loginByUser.consume(userKey);

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
    await registerByIP.consume(ip);
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
  const ip =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
  try {
    await globalAPIByIP.consume(ip);
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
    await passwordResetLimiter.consume(req.ip);
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
    await emailVerificationLimiter.consume(req.ip);
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
    await twoFactorLimiter.consume(req.ip);
    next();
  } catch (err) {
    return res.status(429).json({
      success: false,
      message: "Too many 2FA attempts. Try again later.",
    });
  }
}

module.exports = {
  loginRateLimiter,
  registerRateLimiter,
  globalAPIRateLimiter,
  passwordResetRateLimiter,
  emailVerificationRateLimiter,
  twoFactorRateLimiter,
};
