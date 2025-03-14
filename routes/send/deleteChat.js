const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { deleteChat } = require('../../controllers/chat');
const { defaultLimiter } = require('../../middleware/rateLimiter');
const router = express.Router();

router.delete('/delete-chat/:id', validateToken, defaultLimiter, deleteChat);

module.exports = router;