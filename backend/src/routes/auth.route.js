const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const redisRateLimiter = require("../middlewares/rateLimiter.middleware");
const validators = require("../middlewares/validators.middleware");

/**
 * @route POST api/auth/register
 * @desc Register a new user and return JWT token in cookie
 * @access Public
 */
router.post(
  "/register",
  redisRateLimiter.registerRateLimiter,
  validators.registerValidators,
  authController.registerController,
);

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token in cookie
 * @access Public
 */
router.post(
  "/login",
  redisRateLimiter.loginRateLimiter,
  validators.loginValidators,
  authController.loginController,
);

/**
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Public
 */
router.post("/logout", authController.logoutController);

/**
 * @route GET api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
router.get(
  "/get-me",
  authMiddleware.createAuthMiddleware(["user"]),
  authController.getMeController,
);

/**
 * @route POST api/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Private
 */
router.post("/refresh-token", authController.refreshTokenController);

/**
 * @route POST api/auth/request-password-reset
 * @desc Request password reset link to be sent to email
 * @access Public
 */
router.post(
  "/request-password-reset",
  redisRateLimiter.passwordResetRateLimiter,
  validators.requestPasswordResetValidators,
  authController.requestPasswordResetController,
);

/**
 * @route POST api/auth/verify-reset-token
 * @desc Verify if the password reset token is valid and not expired
 * @access Public
 * */
router.post(
  "/verify-reset-token",
  validators.verifyResetTokenValidators,
  authController.verifyResetTokenController,
);

/**
 * @route POST api/auth/send-verification-email
 * @desc Send email verification link to user's email
 * @access Private
 */
router.post(
  "/send-verification-email",
  redisRateLimiter.emailVerificationRateLimiter,
  validators.sendVerificationEmailValidators,
  authController.sendVerificationEmailController,
);

/**
 * @route GET api/auth/verify-email/:token
 * @desc Verify user's email using the token sent in verification email
 * @access Public
 */
router.get("/verify-email/:token", authController.verifyEmailController);

/**
 * @route POST api/auth/resend-verification-email
 * @desc Resend email verification link to user's email
 * @access Public
 */
router.post(
  "/resend-verification-email",
  redisRateLimiter.emailVerificationRateLimiter,
  validators.sendVerificationEmailValidators,
  authController.resendVerificationEmailController,
);

module.exports = router;
