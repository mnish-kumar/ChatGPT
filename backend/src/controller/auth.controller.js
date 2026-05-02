const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/token.model");
const redisClient = require("../config/redis");
const userCache = require("../cache/user.cache");
const authRedisService = require("../services/redis.service");
const hash = require("../utils/hash.utils");
const emailService = require("../services/email.service");

const isProduction = process.env.NODE_ENV === "production";

const options = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
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
    plan: [
      {
        type: "FREE",
        startDate: new Date(),
        expiry: null,
        payment: null,
        razorpaySubscriptionId: null,
      },
    ],
  });

  // Generate access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
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
    accessToken: accessToken,
  });
}

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token in cookie
 * @access Public
 */
async function loginController(req, res) {
  const { username, email, password } = req.body;

  const query = [];
  if (email) query.push({ email });
  if (username) query.push({ username });

  const user = await userModel.findOne({ $or: query });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!username){
    return res.status(400).json({
      success: false,
      message: "Username is required",
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
    accessToken: accessToken,
  });
}

/***
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Private
 */
async function logoutController(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  const accessToken = req.headers.authorization?.split(" ")[1];
  const sessionId = req.cookies.sessionId;
  const userId = req.user._id.toString();

  if (!accessToken || !sessionId) {
    return res.status(401).json({
      message: "Unauthorized token",
    });
  }

  try {
    let decoded;
    try {
      decoded = accessToken ? jwt.verify(accessToken, process.env.JWT_SECRET) : null; 
    } catch (err) {
      res.clearCookie("refreshToken", options);
      res.clearCookie("sessionId", options);
      return res.status(200).json({ success: true, message: "Logged out" });
    }

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    if (ttl > 0) {
      await redisClient.set(`blacklist:${accessToken}`, "blacklist", "EX", ttl);
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
      role: user.role,
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
    // Identify the user from the refresh token itself.
    const decodedJwt = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decodedJwt?.id;

    const decoded = await authRedisService.verifyRefreshToken(
      refreshToken,
      userId,
      sessionId,
    );

    const newAccessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // Reuse the same sessionId so the frontend cookie remains consistent.
    await authRedisService.setRefreshToken(decoded.id, newRefreshToken, req, sessionId);

    res.cookie("refreshToken", newRefreshToken, {
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
      accessToken: newAccessToken,
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

/**
 * @route GET api/auth/verify-email/:token
 * @desc Verify user's email using the token sent in verification email
 * @access Public
 */
async function verifyEmailController(req, res) {
  const { token } = req.params;

  try {
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const hashedToken = hash.hashToken(token);

    const key = `emailVerification:${hashedToken}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    await userModel.findByIdAndUpdate(userId, { isEmailVerified: true });
    await redisClient.del(key);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @route POST api/auth/send-verification-email
 * @desc Send email verification link to user's email
 * @access Public
 * */
async function sendVerificationEmailController(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const verificationToken = hash.generateVerificationToken();
    const hashedToken = hash.hashToken(verificationToken);

    // Store hashed token in Redis with 24 hour TTL
    const key = `emailVerification:${hashedToken}`;
    await redisClient.set(key, user._id.toString(), "EX", 24 * 60 * 60);

    // Send verification email with link to verify email address
    const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`;

    // ✅ Send email (controller will catch any errors)
    await emailService.sendVerificationEmail(email, verificationLink);

    return res.status(200).json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    console.error("sendVerificationEmailController error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @route POST api/auth/resend-verification-email
 * @desc Resend email verification link to user's email
 * @access Public
 * */
async function resendVerificationEmailController(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const existKey = await redisClient.keys(
      `emailVerification:*:${user._id.toString()}`,
    );
    for (const key of existKey) {
      const storedUserId = await redisClient.get(key);
      if (storedUserId === user._id.toString()) {
        await redisClient.del(key);
        break;
      }
    }

    const verificationToken = hash.generateVerificationToken();
    const hashedToken = hash.hashToken(verificationToken);

    const key = `emailVerification:${hashedToken}`;
    await redisClient.set(key, user._id.toString(), {
      EX: 24 * 60 * 60, // 24 hours
    });

    const verificationLink = `${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`;

    // ✅ Send email (controller will catch any errors)
    await emailService.sendVerificationEmail(email, verificationLink);

    return res.status(200).json({
      success: true,
      message: "Verification email resent. Please check your inbox.",
    });
  } catch (err) {
    console.error("resendVerificationEmailController error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @route GET api/auth/google/callback
 * @desc Handle Google OAuth callback and issue JWT token
 * @access Public
 * */
async function googleAuthController(req, res) {
  try {
    const user = req.user;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Generate access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", sessionId, {
      ...options,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(302, `${frontendUrl}/dashboard`);
  } catch (err) {
    console.error("googleCallback error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
  refreshTokenController,
  verifyEmailController,
  sendVerificationEmailController,
  resendVerificationEmailController,
  googleAuthController,
};
