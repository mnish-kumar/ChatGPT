const Redis = require("ioredis");

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

// ─── Main app client (rate limit, cache, sessions)─
const redisClient = new Redis(redisOptions);

// ─── BullMQ connection
const bullMQRedis = new Redis({
  ...redisOptions,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisClient.on("error", (err) => 
  console.error("Redis Client Error❌", err)
);
redisClient.on("connect", () => 
  console.log("Connected to Redis✅")
);

redisClient.on("reconnecting", () => 
  console.log("🔄 Redis reconnecting...")
);

bullMQRedis.on("error", (err) => console.error("BullMQ Redis Error❌", err));

module.exports = { redisClient, bullMQRedis };
