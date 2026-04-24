const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/token.model");
const redisClient = require("../config/redis");
const userCache = require("../cache/user.cache");


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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
  const user = await userModel.findOne({ email });

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


  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
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

  const BlacklistToken = req.cookies.token;

  if (!BlacklistToken) {
    return res.status(401).json({
      message: "Unauthorized token",
    })
  }

  try {
    await blacklistTokenModel.create({
      token: BlacklistToken,
    });

    res.clearCookie("token");

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

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
};
