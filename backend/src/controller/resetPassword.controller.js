const userModel = require('../models/user.model');
const authRedisService = require("../services/redis.service");
const emailService = require("../services/email.service");
const hash = require("../utils/hash.utils");
const redisClient = require("../config/redis");
const bcrypt = require("bcryptjs");

/**
 * @route POST api/auth/request-password-reset
 * @desc Request password reset link to be sent to email
 * @access Public
 */
async function requestPasswordResetController(req, res) {
  const { email } = req.body;

  try {
    const user = await userModel
      .findOne({ email })
      .select("_id email username fullname")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Store hashed token in Redis (15 min TTL)
    const resetToken = await authRedisService.passwordResetTokenSet(user._id);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    return res.status(200).json({
      success: true,
      message:
        "If this email exists, a reset link has been sent. Please check your inbox.",
    });
  } catch (err) {
    console.error("[requestPasswordResetController] error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

/**
 * @route POST api/auth/reset-password
 * @desc Reset password using the token sent to email
 * @access Public
 * */
async function resetPasswordController(req, res) {
  const { token, id, newPassword } = req.body;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedToken = hash.hashToken(token);

    // Check redis for hashed token and user ID
    const key = `passwordReset:${id}`;
    const storedHashedToken = await redisClient.get(key);

    if (!storedHashedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (storedHashedToken !== hashedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, genSalt);

    await userModel.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    // Delete the token from Redis
    await redisClient.del(key);

    const sessionKeys = await redisClient.keys(`refreshToken:${id}:*`);

    if (sessionKeys.length > 0) {
      await redisClient.del(sessionKeys);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("[resetPasswordController] error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

/**
 * @route POST api/auth/verify-reset-token
 * @desc Verify if the password reset token is valid and not expired
 * @access Public
 * */
async function verifyResetTokenController(req, res) {
  const { token, id } = req.body;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedToken = hash.hashToken(token);

    // Check redis for hashed token and user ID
    const key = `passwordReset:${id}`;
    const storedHashedToken = await redisClient.get(key);

    if (!storedHashedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (storedHashedToken !== hashedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (err) {
    console.error("[verifyResetTokenController] error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  requestPasswordResetController,
  resetPasswordController,
  verifyResetTokenController,
};
