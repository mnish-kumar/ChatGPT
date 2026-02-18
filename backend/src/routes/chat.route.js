const express = require('express');
const router = express.Router();
const authUserMiddleware  = require('../middlewares/auth.middleware');
const ChatController  = require('../controller/chat.controller');


/* POST/api/chat */
router.post('/', authUserMiddleware.authUserMiddleware, ChatController.createChat);

module.exports = router;