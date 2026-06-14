const hash = require("../utils/hash.utils");
const { redisClient } = require("../config/redis");

const MAX_CACHE_BYTES = parseInt(process.env.MAX_CACHE_BYTES) || 102400; // 100KB default
const RESPONSE_TTL = parseInt(process.env.RESPONSE_TTL) || 86400;

function normalizeMessage(userMessage){
    if (!userMessage) {
        throw new Error("Invalid message input !")
    }
    return userMessage.trim().toLowerCase().replace(/\s+/g, " ");
}

const inFlight = new Map();
async function getChatCache(chatId, userMessage) {
  const key = `ai-response:${chatId}:${hash.hashKey(normalizeMessage(userMessage))}`;

  if (inFlight.has(key)) return await inFlight.get(key);

  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error("Redis GET error:", err.message);
    return null;
  }
}

async function setChatCache(userId, chatId, userMessage, response) {
  const key = `ai-response:${chatId}:${hash.hashKey(normalizeMessage(userMessage))}`;

  const payload = JSON.stringify({ userId, question: userMessage, response });

  if (Buffer.byteLength(payload) > MAX_CACHE_BYTES) {
    console.warn("Cache skipped: payload too large for key:", key);
    return;
  }

  const promise = redisClient.set(key, payload, "EX", RESPONSE_TTL);
  inFlight.set(key, promise);

  try {
    await promise;
  } catch (err) {
    console.error("Redis SET error:", err.message);
  } finally {
    inFlight.delete(key);
  }
}

module.exports = {
    getChatCache,
    setChatCache
}