const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const redisRateLimiter = require("../middlewares/rateLimiter.middleware");
const validators = require("../middlewares/validators.middleware");
const passport = require("../config/passport");
const authRedisService = require("../services/redis.service");
const jwt = require("jsonwebtoken");


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
router.post("/logout", authMiddleware.createAuthMiddleware(), authController.logoutController);

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

/**
 * @route GET api/auth/google
 * @desc Initiate Google OAuth login flow
 * @access Public
 * */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

/**
 * @route GET api/auth/google/callback
 * @desc Handle Google OAuth callback and issue JWT token
 * @access Public
 * */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/google/failure",
  }),
  authController.googleAuthController,
);

/**
 * @route GET api/auth/google/failure
 * @desc Handle Google OAuth failure
 * @access Public
 * */
router.get("/google/failure", (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Google login failed",
  });
});


router.post("/google/exchange", authMiddleware.createAuthMiddleware(), async (req, res) => {
  try {
    const user = req.user;

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const { sessionId } = await authRedisService.setRefreshToken(
      user._id.toString(),
      refreshToken,
      req
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});


module.exports = router;
