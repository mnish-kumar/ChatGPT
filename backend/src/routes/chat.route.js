const express = require('express');
const router = express.Router();
const authUserMiddleware  = require('../middlewares/auth.middleware');
const ChatController  = require('../controller/chat.controller');


/* POST/api/chat */
router.post('/', authUserMiddleware.authUserMiddleware, ChatController.createChat);


/**
 * @route GET /api/chat
 * @desc Get all chats of the authenticated user
 * @access Private
 */
router.get('/', authUserMiddleware.authUserMiddleware, ChatController.getUserChats);

module.exports = router;