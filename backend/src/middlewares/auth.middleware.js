const userModel = require('../models/user.models');
const jwt = require('jsonwebtoken');


async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({message: "User not found"});
        }

        req.user = user;
        next();
    }catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}


module.exports = {
    authUserMiddleware,
}