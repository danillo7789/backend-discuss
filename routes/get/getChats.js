const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getChats, AllChats } = require('../../controllers/chat');
const router = express.Router();

router.get('/chats/:id', validateToken, getChats);
router.get('/chats', validateToken, AllChats);

module.exports = router;