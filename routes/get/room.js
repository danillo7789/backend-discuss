const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getRoom } = require('../../controllers/room');
const router = express.Router();
const { defaultLimiter } = require('../../middleware/rateLimiter.js');

router.get('/room/:id', validateToken, defaultLimiter, getRoom);

module.exports = router;