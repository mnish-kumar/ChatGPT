const Redis = require("ioredis");
const logger = require("./logger");


const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    if (times > 10) return null;
    return Math.min(times * 500, 3000);
  },
  keepAlive: 10000,
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
};

// Main app client (rate limit, cache, sessions)─
const redisClient = new Redis(redisOptions);

// BullMQ connection
const bullMQRedis = new Redis({
  ...redisOptions,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisClient.on("error", (err) => 
  logger.error("Redis Client Error❌", err)
);
redisClient.on("connect", () => 
  logger.info("Connected to Redis✅")
);

redisClient.on("reconnecting", () => 
  logger.info("🔄 Redis reconnecting...")
);

bullMQRedis.on("error", (err) => logger.error("BullMQ Redis Error❌", err));

module.exports = { redisClient, bullMQRedis };
