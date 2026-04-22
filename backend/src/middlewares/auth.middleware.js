const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/token.model');


function createAuthMiddleware(roles = []) {
    return async function authMiddleware(req, res, next) {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({message: "Unauthorized"});
        }

        // Check if token is blacklisted (logged out)
        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Token is blacklisted. Please login again."
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return res.status(401).json({message: "User not found"});
            }

            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({message: "Forbidden"});
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    };
}

module.exports = {
    createAuthMiddleware,
}