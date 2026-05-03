const redisClient = require("../config/redis");

const CACHE_TTL_SECONDS = 60 * 10; // 10 minutes
// Bump this when the cached payload shape changes.
const CACHE_VERSION = "v3";

const userKey = (userId) => `user:${CACHE_VERSION}:${userId}`;

function parseUserCache(raw) {
  try {
    return { data: JSON.parse(raw), corrupted: false };
  } catch {
    return { data: null, corrupted: true };
  }
}

const setUserCache = async (userId, userData) => {
  try {
    const serializedData = JSON.stringify(userData);

    redisClient.set(userKey(userId), serializedData, "EX", CACHE_TTL_SECONDS);
  } catch (err) {
    console.error("Error setting user cache:", err);
    return false;
  }
};

const getUserCache = async (userId) => {
  try {
    const cachedData = await redisClient.get(userKey(userId));

    if (!cachedData) return null;

    const { data, corrupted } = parseUserCache(cachedData);

    if (corrupted) {
      console.warn(
        `[UserCache] Corrupted cache for userId=${userId}, deleting...`,
      );
      await redisClient.del(userKey(userId));
      return null;
    }
    return data;
  } catch (err) {
    console.error(`[UserCache] get failed for userId=${userId}:`, err);
    return null;
  }
};

const deleteUsersCache = async (userIds = []) => {
  try {
    const keys = userIds.map(userKey);
    await redisClient.del(keys);
  } catch (err) {
    console.error("Batch delete failed:", err);
  }
};

const getUserCacheTTL = async (userId) => {
  try {
    return await redisClient.ttl(userKey(userId));
  } catch (err) {
    console.error("Error getting user cache TTL:", err);
    return null;
  }
};

const refreshUserCacheTTL = async (userId) => {
  try {
    const result = await redisClient.expire(userKey(userId), CACHE_TTL_SECONDS);

    // expire returns 1 if the timeout was set, 0 if the key does not exist
    return result === 1;
  } catch (err) {
    console.error(`[UserCache] expire failed for userId=${userId}:`, err);
    return false;
  }
};

module.exports = {
  setUserCache,
  getUserCache,
  deleteUsersCache,
  getUserCacheTTL,
  refreshUserCacheTTL,
};
