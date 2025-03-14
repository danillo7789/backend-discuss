const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getChats, AllChats } = require('../../controllers/chat');
const router = express.Router();
const { createRateLimiter } = require('../../middleware/rateLimiter.js');
const chatLimiter = createRateLimiter(10, 2000, 'chats');

router.get('/chats/:id', validateToken, chatLimiter, getChats);
router.get('/chats', validateToken, chatLimiter, AllChats);

module.exports = router;