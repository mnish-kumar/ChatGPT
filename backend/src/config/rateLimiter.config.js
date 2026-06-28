const { RateLimiterRedis, RateLimiterMemory } = require("rate-limiter-flexible");
const { redisClient } = require("../config/redis")

function makeLimiter(opts) {
  return new RateLimiterRedis({
    storeClient: redisClient,
    insuranceLimiter: new RateLimiterMemory({
      points: opts.points,
      duration: opts.duration,
      blockDuration: opts.blockDuration || 60,
    }),
    ...opts,
  });
}


/**
 * Login — per IP
 * 5 attempts per 15 min window; 1-hour block after exhaustion.
 * inmemoryBlockOnConsumed reduces Redis round-trips under a brute-force flood.
 */
const loginByIP = new makeLimiter({
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
const loginByUser = new makeLimiter({
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
const registerByIP = new makeLimiter({
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
const globalAPIByIP = new makeLimiter({
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
const passwordResetLimiter = new makeLimiter({
  storeClient: redisClient,
  keyPrefix: "rl:password_reset",
  points: 5,
  duration: 60 * 60, 
  blockDuration: 60 * 60,
});


const emailVerificationLimiter = new makeLimiter({
  storeClient: redisClient,
  keyPrefix: "rl:email_verification",
  points: 3,
  duration: 60 * 60, 
  blockDuration: 60 * 60,
})


const twoFactorLimiter = new makeLimiter({
  storeClient: redisClient,
  keyPrefix: "rl:2fa",
  points: 5,               
  duration: 60 * 10,       
  blockDuration: 60 * 30,
});

// RateLimit on chat request
const chatRoomCreateLimiter = makeLimiter({
  keyPrefix: "chat_room_create",
  points: 5,
  duration: 60 * 1, // 1 minute window
  blockDuration: 60 * 60,
});

// Chat limiters
const chatFreeLimiterMinute = makeLimiter({
  keyPrefix: "chat_free_min",
  points: 2,
  duration: 60,
  blockDuration: 300, // 5 minutes block after exceeding the limit
});

const chatFreeLimiterHour = makeLimiter({
  keyPrefix: "chat_free_hour",
  points: 100,
  duration: 60 * 60,
  blockDuration: 60 * 60, // 1 hour block after exceeding the limit
});

const chatFreeLimiterDay = makeLimiter({
  keyPrefix: "chat_free_day",
  points: 500,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24,
});

const chatPremiumLimiterMinute = makeLimiter({
  keyPrefix: "chat_premium_min",
  points: 60,
  duration: 60,
  blockDuration: 60,
});

const chatPremiumLimiterHour = makeLimiter({
  keyPrefix: "chat_premium_hour",
  points: 500,
  duration: 60 * 60,
  blockDuration: 300,
});

const chatPremiumLimiterDay = makeLimiter({
  keyPrefix: "chat_premium_day",
  points: 2000,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 30,
});

const socketIPLimiterMinute = makeLimiter({
  keyPrefix: "socket_ip_min",
  points: 100,
  duration: 60,
  blockDuration: 60 * 15,
});

const socketIPLimiterHour = makeLimiter({
  keyPrefix: "socket_ip_hour",
  points: 500,
  duration: 60 * 60,
  blockDuration: 60 * 60,
});

module.exports = {
  chatFreeLimiterMinute,
  chatFreeLimiterHour,
  chatFreeLimiterDay,
  chatPremiumLimiterMinute,
  chatPremiumLimiterHour,
  chatPremiumLimiterDay,
  socketIPLimiterMinute,
  socketIPLimiterHour,
  loginByIP,
  loginByUser,
  registerByIP,
  globalAPIByIP,
  passwordResetLimiter,
  emailVerificationLimiter,
  twoFactorLimiter,
  chatRoomCreateLimiter,
};
