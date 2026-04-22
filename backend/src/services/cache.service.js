const { redisClient } = require('../config/redis');

async function getCache(key) {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Cache error:", error);
        throw error;
    }
}

async function setCache(key, value, ttlSeconds) {
    try {
        await redisClient.setEx(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    catch (error) {
        console.error("Cache error:", error);
        throw error;
    }
}

module.exports = {
    getCache,
    setCache
};