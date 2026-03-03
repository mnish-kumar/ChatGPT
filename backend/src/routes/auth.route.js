const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');


/**  
 * @route POST api/auth/register
 * @desc Register a new user and return JWT token in cookie
 * @access Public
 */
router.post('/register', authController.registerController);

/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token in cookie
 * @access Public
 */
router.post('/login', authController.loginController);

/**
 * @route POST api/auth/logout
 * @desc Clear token from user cookies and add token to blacklist
 * @access Public
 */
router.post('/logout', authController.logoutController);


router.get('/get-me', authController.getMeController);

module.exports = router;