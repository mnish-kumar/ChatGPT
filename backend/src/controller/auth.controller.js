const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/token.model");
const redisClient = require("../config/redis");
const userCache = require("../cache/user.cache");
const authRedisService = require("../services/redis.service");


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
      message: "User already exist !" 
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
  });

  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  const { sessionId } = await authRedisService.setRefreshToken(
    user._id.toString(),
    refreshToken,
    req
  );

  res.cookie("token",accessToken,{
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken",refreshToken,{
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("sessionId",sessionId,{
    httpOnly: true,
    secure: true
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      fullname: user.fullname,
    },
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
    $or: [
      { email: email },
      { username: username }
    ]
  });

  if (!user) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid email or password" 
    });
  }


  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid password !" 
    });
  }


  // Generate access token
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  // Generate refresh token
  const refreshToken = jwt.sign({
    id: user._id,
    username: user.username,
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });


  // Store refresh token in Redis
  const { sessionId } = await authRedisService.setRefreshToken(
    user._id.toString(),
    refreshToken,
    req
  )

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true
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
  });
}

/***
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Private
 */
async function logoutController(req, res) {

  const accessToken = req.cookies.token;
  const sessionId = req.cookies.sessionId;
  const userId = req.user.id;

  if (!accessToken || !sessionId) {
    return res.status(401).json({
      message: "Unauthorized token",
    })
  }

  try {
    await redisClient.set(
      `blacklist:${accessToken}`,
      "blacklisted",
      {
        EX: 15 * 60 // blacklist for 15 minutes (same as token expiry)
      }
    )

    if (sessionId) {
      await authRedisService.deleteRefreshToken(userId, sessionId);
    }

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("sessionId", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
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
      sessionId
    );

    const newAccessToken = jwt.sign({
      id: decoded.id,
      username: decoded.username,
    }, process.env.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
    });

  }catch (error) {
    if (error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError") {
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
  refreshTokenController
};
