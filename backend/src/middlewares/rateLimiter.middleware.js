const configRateLimiter = require("../config/rateLimit.config");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../config/redis");

const loginByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_ip",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 60,
});

const login_user = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_user",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 60,
});

const registerByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "register_ip",
  points: 5,
  duration: 60 * 15,
  blockDuration: 60 * 60,
});

const globalAPIByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "global_api_ip",
  points: 100,
  duration: 60,
});

const loginRateLimiter = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;

  const userKey = (req.body?.email || "unknown_user").toLowerCase().trim();
  try {
    // Consume points for IP
    await loginByIP.consume(ip);

    // Consume points for User
    await login_user.consume(userKey);
    
  } catch (err) {
    if (err instanceof Error) {
      console.warn({
        message: "Rate Limiter Error",
        error: err.message,
        ip,
        userKey,
      });
      return res.status(500).json({ message: "Internal Server Error" });
    }
    
    return next();
  }
};


const registerRateLimiter = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
  try {
    await registerByIP.consume(ip);
    next();
  } catch (err) {
    if (err instanceof Error) {
      console.warn({
        message: "Rate Limiter Error",
        error: err.message,
        ip,
      });
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return next();
  }
};


const globalAPIRateLimiter = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
  try {
    await globalAPIByIP.consume(ip);
    next();
  } catch (err) {
    if (err instanceof Error) {
      console.warn({
        message: "Rate Limiter Error",
        error: err.message,
        ip,
      });
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return next();
  }
};

module.exports = {
  loginRateLimiter,
  registerRateLimiter,
  globalAPIRateLimiter,
};