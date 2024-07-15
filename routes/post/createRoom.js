const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { createRoom } = require('../../controllers/room');
const router = express.Router();

router.post('/create-room', validateToken, createRoom);

module.exports = router;