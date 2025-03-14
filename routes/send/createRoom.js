const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { createRoom } = require('../../controllers/room');
const { defaultLimiter } = require('../../middleware/rateLimiter');
const router = express.Router();

router.post('/create-room', validateToken, defaultLimiter, createRoom);

module.exports = router;