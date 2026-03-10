const express = require('express');
const router = express.Router();
const authUserMiddleware  = require('../middlewares/auth.middleware');
const ChatController  = require('../controller/chat.controller');


/* 
* @route POST /api/chat
* @desc Create a new chat
* @access Private
*/
router.post('/', authUserMiddleware.authUserMiddleware, ChatController.createChat);


/**
 * @route GET /api/chat
 * @desc Get all chats of the authenticated user
 * @access Private
 */
router.get('/', authUserMiddleware.authUserMiddleware, ChatController.getUserChats);


/**
 * @route GET /api/chat/:chatId/messages
 * @desc Get all messages for a specific chat
 * @access Private
 */
router.get('/:chatId/messages', authUserMiddleware.authUserMiddleware, ChatController.getChatMessages);

/**
 * @route DELETE /api/chat/deleteChat/chatID/:chatId
 * @desc Delete a specific chat by ID
 * @access Private
 */
router.delete('/deleteChat/chatID/:chatId', authUserMiddleware.authUserMiddleware, ChatController.deleteChat);

module.exports = router;