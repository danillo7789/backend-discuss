const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { postChat } = require('../../controllers/chat');
const router = express.Router();

router.post('/post-chat/:id', validateToken, postChat);

module.exports = router;