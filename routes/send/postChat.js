const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { postChat } = require('../../controllers/chat');
const router = express.Router();
const { createRateLimiter } = require('../../middleware/rateLimiter.js');
const chatLimiter = createRateLimiter(10, 2000, 'chats');

router.post('/post-chat/:id', validateToken, chatLimiter, postChat);

module.exports = router;