const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const redisRateLimiter = require('../middlewares/rateLimiter.middleware');


/**  
 * @route POST api/auth/register
 * @desc Register a new user and return JWT token in cookie
 * @access Public
 */
router.post('/register', redisRateLimiter.registerRateLimiter, authController.registerController);

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token in cookie
 * @access Public
 */
router.post('/login', redisRateLimiter.loginRateLimiter, authController.loginController);

/**
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Public
 */
router.post('/logout', authController.logoutController);


/**
 * @route GET api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
router.get('/get-me', authMiddleware.createAuthMiddleware(["user"]), authController.getMeController);

module.exports = router;