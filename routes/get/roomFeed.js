const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { roomFeed } = require('../../controllers/roomFeed');
const router = express.Router();
const { createRateLimiter } = require('../../middleware/rateLimiter.js');
const roomFeedLimiter = createRateLimiter(10, 1500, 'room feed');

router.get('/room-feed', validateToken, roomFeedLimiter, roomFeed);
//unAuth roomfeed
// router.get('/un-auth/room-feed', roomFeed);

module.exports = router;