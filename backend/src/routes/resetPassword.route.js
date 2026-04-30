const express = require("express");
const router = express.Router();
const redisRateLimiter = require("../middlewares/rateLimiter.middleware");
const validators = require("../middlewares/validators.middleware");
const resetPasswordController = require("../controller/resetPassword.controller");

/**
 * @route POST api/auth/request-password-reset
 * @desc Request password reset link to be sent to email
 * @access Public
 */
router.post(
  "/request-password-reset",
  redisRateLimiter.passwordResetRateLimiter,
  validators.requestPasswordResetValidators,
  resetPasswordController.requestPasswordResetController,
);

/**
 * @route POST api/auth/verify-reset-token
 * @desc Verify if the password reset token is valid and not expired
 * @access Public
 * */
router.post(
  "/verify-reset-token",
  validators.verifyResetTokenValidators,
  resetPasswordController.verifyResetTokenController,
);

/**
 * @route POST api/auth/reset-password
 * @desc Reset password using the token sent to email
 * @access Public
 */
router.post(
  "/reset-password",
  validators.resetPasswordValidators,
  resetPasswordController.resetPasswordController,
);

module.exports = router;
