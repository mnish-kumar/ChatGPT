const redisClient = require("../config/redis");
const hashUtils = require("../utils/hash.utils");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

async function setRefreshToken(userId, refreshToken, req, sessionId = uuidv4()) {
    const key = `refreshToken:${userId}:${sessionId}`;
    const hashedToken = hashUtils.hashToken(refreshToken);
    
    const value = JSON.stringify({
        token: hashedToken,
        sessionId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        createdAt: Date.now()
    })

    await redisClient.set(key, value, "EX", 7 * 24 * 60 * 60); // 7 days expiration

    return {
        sessionId,
        key
    }

}



async function verifyRefreshToken (refreshToken, userId, sessionId) {
    try {
        // Verify jwt 
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (decoded?.id?.toString() !== userId?.toString()) {
            throw new Error("Refresh token user mismatch");
        }

        const key = `refreshToken:${userId}:${sessionId}`;

        const storedRefreshToken = await redisClient.get(key);

        if (!storedRefreshToken) {
            throw new Error("Refresh token not found in redis");
        }
        const parsed = JSON.parse(storedRefreshToken);
        const hashedToken = hashUtils.hashToken(refreshToken);

        if (parsed.token !== hashedToken) {
            throw new Error("Invalid refresh token");
        }

        return decoded;
    }catch (error) {
        throw error;
    }
}



async function deleteRefreshToken(userId, sessionId) {
    const key = `refreshToken:${userId}:${sessionId}`;
    await redisClient.del(key);
}

module.exports = {
    setRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken
}