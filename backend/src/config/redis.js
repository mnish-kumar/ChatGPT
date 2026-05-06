const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,

  // ✅ Auto reconnect
  retryStrategy(times) {
    if (times > 10) return null;
    return Math.min(times * 500, 3000); // 500ms, 1s, 1.5s... max 3s
  },

  
  keepAlive: 10000,        
  connectTimeout: 10000,  
  maxRetriesPerRequest: 3,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error❌", err);
});

redisClient.on("connect", () => {
  console.log("Connected to Redis✅");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

module.exports = redisClient;