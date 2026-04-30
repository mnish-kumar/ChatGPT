const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const twoFactorController = require("../controller/twoFactor.controller");
const redisRateLimiter = require("../middlewares/rateLimiter.middleware");

/**
 * @route POST api/auth/2fa/setup
 * @desc Generate QR code for 2FA setup
 * @access Private
 */
router.post(
  "/setup",
  authMiddleware.createAuthMiddleware(),
  twoFactorController.setup2FAController,
);

/**
 * @route POST api/auth/2fa/enable
 * @desc Verify first OTP and enable 2FA for the user
 * @access Private
 */
router.post(
  "/enable",
  authMiddleware.createAuthMiddleware(["user"]),
  redisRateLimiter.twoFactorRateLimiter,
  twoFactorController.enable2FAController,
);

/**
 * @route POST api/auth/2fa/verify
 * @desc Verify OTP during login
 * @access Private
 */
router.post(
  "/verify",
  authMiddleware.createAuthMiddleware(["user"]),
  redisRateLimiter.twoFactorRateLimiter,
  twoFactorController.verify2FAController,
);

/**
 * @route POST api/auth/2fa/disable
 * @desc Disable 2FA for the user
 * @access Private
 * */
router.post(
  "/disable",
  authMiddleware.createAuthMiddleware(["user"]),
  redisRateLimiter.twoFactorRateLimiter,
  twoFactorController.disable2FAController,
);

module.exports = router;
