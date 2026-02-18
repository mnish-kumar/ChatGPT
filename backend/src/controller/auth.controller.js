const bcrypt = require("bcryptjs");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

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

module.exports = {
  registerController,
  loginController,
};
