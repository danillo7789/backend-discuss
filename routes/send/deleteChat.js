const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { deleteChat } = require('../../controllers/chat');
const router = express.Router();

router.delete('/delete-chat/:id', validateToken, deleteChat);

module.exports = router;