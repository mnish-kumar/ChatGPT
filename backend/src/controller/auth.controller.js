const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/token.model");
const redisClient = require("../config/redis");
const userCache = require("../cache/user.cache");
const authRedisService = require("../services/redis.service");

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
};

/**
 * @route POST api/auth/register
 * @desc Register a new user and return JWT token in cookie
 * @access Public
 */
async function registerController(req, res) {
  const {
    email,
    username,
    fullname: { firstname, lastname },
    password,
  } = req.body;

  const isAlreadyExist = await userModel.findOne({
    email,
  });

  if (isAlreadyExist) {
    return res.status(400).json({
      message: "User already exist !",
    });
  }

  // Hash the password
  const genSalt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, genSalt);

  // Create user
  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    username,
    email,
    password: hashedPassword,
    plan: [],
  });

  // Generate access token
  const accessToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  // Store refresh token in Redis
  const { sessionId } = await authRedisService.setRefreshToken(
    user._id.toString(),
    refreshToken,
    req,
  );

  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("sessionId", sessionId, {
    ...options,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
    },
    token: accessToken,
  });
}

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token in cookie
 * @access Public
 */
async function loginController(req, res) {
  // Implementation for login
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid password !",
    });
  }

  // Generate access token
  const accessToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Store refresh token in Redis
  const { sessionId } = await authRedisService.setRefreshToken(
    user._id.toString(),
    refreshToken,
    req,
  );

  res.cookie("refreshToken", refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("sessionId", sessionId, {
    ...options,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
    },
    token: accessToken,
  });
}

/***
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Private
 */
async function logoutController(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const sessionId = req.cookies.sessionId;
  const userId = req.user.id;

  if (!accessToken || !sessionId) {
    return res.status(401).json({
      message: "Unauthorized token",
    });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      res.clearCookie("refreshToken", options);
      res.clearCookie("sessionId", options);
      return res.status(200).json({ success: true, message: "Logged out" });
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await redisClient.set(`blacklist:${accessToken}`, "blacklisted", {
        EX: ttl, // blacklist until token would have expired
      });
    }

    await authRedisService.deleteRefreshToken(userId, sessionId);

    res.clearCookie("refreshToken", options);
    res.clearCookie("sessionId", options);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}

/**
 * @route GET api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */

async function getMeController(req, res) {
  const userId = req.user.id;

  try {
    // 1. Cache first
    const cachedUser = await userCache.getUserCache(userId);

    if (cachedUser) {
      // fire-and-forget (non-blocking)
      userCache.refreshUserCacheTTL(userId);

      return res.status(200).json({
        success: true,
        data: cachedUser,
      });
    }

    // ── 2. DB query
    const user = await userModel
      .findById(userId)
      .select("_id email username fullname")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Prepare response (single source)
    const response = {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
    };

    // 4. Set cache
    userCache.setUserCache(userId, response);

    return res.status(200).json(response);
  } catch (err) {
    console.error("[getMeController] error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

/**
 * @route POST api/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Private
 */
async function refreshTokenController(req, res) {
  const sessionId = req.cookies.sessionId;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !sessionId) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = await authRedisService.verifyRefreshToken(
      refreshToken,
      req.user.id,
      sessionId,
    );

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await authRedisService.setRefreshToken(
      decoded.id,
      newRefreshToken,
      sessionId,
    );

    res.cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("sessionId", sessionId, {
      ...options,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
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

    return res.status(401).json({
      success: false,
      message: "Failed to refresh token",
      error: error.message,
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
  refreshTokenController,
};
