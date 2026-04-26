const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

function createAuthMiddleware(roles = []) {
  return async function authMiddleware(req, res, next) {
    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if token is blacklisted (logged out)
    const isBlacklisted = await redisClient.get(`blacklisted:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You don't have access to this resource",
        });
      }

      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      };

      next();
    } catch (error) {
      if (
        error?.name === "TokenExpiredError" ||
        error?.name === "JsonWebTokenError"
      ) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
}

module.exports = {
  createAuthMiddleware,
};
