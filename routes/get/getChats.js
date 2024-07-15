const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getChats } = require('../../controllers/chat');
const router = express.Router();

router.get('/chats/:id', validateToken, getChats);

module.exports = router;