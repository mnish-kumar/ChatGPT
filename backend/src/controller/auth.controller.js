const bcrypt = require("bcryptjs");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/token.model");


/** 
 * @route POST api/auth/register
 * @desc Register a new user and return JWT token in cookie
 * @access Public
 */
async function registerController(req, res) {
  const {
    email,
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
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
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
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }


  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ 
      message: "Invalid password !" 
    });
  }


  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  
  return res.status(200).json({
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

async function getMeController(req, res){
  const user = await userModel.findById(req.user.id);

  
  return res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user: {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

module.exports = {
  registerController,
  loginController,
  logoutController,
  getMeController,
};
