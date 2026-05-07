const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const {redisClient} = require("../config/redis");
const jwt = require("jsonwebtoken");
const authRedisService = require("../services/redis.service");
const userCache = require("../cache/user.cache");

const { getCookieOptions } = require("../utils/cookieOptions");

const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── Generate QR code for 2FA setup
async function setup2FAController(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (user.twoFactorAuth.enabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `JarviSync (${user.email})`,
      length: 20,
    });

    await userModel.findByIdAndUpdate(userId, {
      "twoFactorAuth.secret": secret.base32,
    });

    // Generate QR code data URL
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    return res.status(200).json({
      success: true,
      message: "2FA setup initiated",
      qrCodeUrl,
      secret: secret.base32,
    });
  } catch (err) {
    console.error("Error in setup2FAController:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during 2FA setup. Please try again later.",
    });
  }
}

// ─── Enable 2FA after verifying the first OTP
async function enable2FAController(req, res) {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP code is required",
      });
    }

    // Get user with 2FA secret
    const user = await userModel.findById(userId);
    if (!user.twoFactorAuth?.secret) {
      return res.status(400).json({
        success: false,
        message: "2FA setup not initiated",
      });
    }

    if (user.twoFactorAuth?.enabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    // Verify OTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code",
      });
    }

    // Generate backup codes
    const backupCodes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase(),
    );

    // Hash backup codes before saving
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => bcrypt.hash(code, 10)),
    );

    // Enable 2FA and save hashed backup codes
    await userModel.findByIdAndUpdate(userId, {
      "twoFactorAuth.enabled": true,
      "twoFactorAuth.backupCodes": hashedBackupCodes,
    });

    // Invalidate cached /get-me payload so UI shows enabled immediately
    await userCache.deleteUsersCache([userId]);

    return res.status(200).json({
      success: true,
      message: "2FA enabled successfully",
      backupCodes,
    });
  } catch (err) {
    console.error("Error in enable2FAController:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during 2FA enabling. Please try again later.",
    });
  }
}

// ─── Verify OTP during login
async function verify2FAController(req, res) {
    const cookieOptions = getCookieOptions(req);
  try {
    const { otp, tempToken } = req.body;

    if (!otp || !tempToken) {
      return res.status(400).json({
        success: false,
        message: "OTP code and temp token are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (!decoded.twoFactorPending) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const userId = decoded.id;

    const storedToken = await redisClient.get(`2fa:pending:${userId}`);
    if (!storedToken || storedToken !== tempToken) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // step1: Get user with 2FA secret
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.twoFactorAuth?.enabled || !user.twoFactorAuth?.secret) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled for this account",
      });
    }

    // step2: Verify OTP
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code",
      });
    }

    await redisClient.del(`2fa:pending:${userId}`);

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    const { sessionId } = await authRedisService.setRefreshToken(
      user._id.toString(),
      refreshToken,
      req,
    );

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    res.cookie("sessionId", sessionId, {
      ...cookieOptions,
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });

    return res.status(200).json({
      success: true,
      message: "2FA verification successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Error in verify2FAController:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during 2FA verification. Please try again later.",
    });
  }
}

// ─── Disable 2FA
async function disable2FAController(req, res) {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required to disable 2FA",
      });
    }

    // Step 1: Get user
    const user = await userModel.findById(userId);
    if (!user.twoFactorAuth?.enabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled",
      });
    }

    // Step 2: Verify OTP before disabling
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorAuth.secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Step 3: Disable 2FA
    await userModel.findByIdAndUpdate(userId, {
      "twoFactorAuth.enabled": false,
      "twoFactorAuth.secret": null,
      "twoFactorAuth.backupCodes": [],
    });

    // Invalidate cached /get-me payload so UI shows disabled immediately
    await userCache.deleteUsersCache([userId]);

    return res.status(200).json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    console.error("disable2FA error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  setup2FAController,
  enable2FAController,
  verify2FAController,
  disable2FAController,
};
