const express = require('express');
const { topicFeed } = require('../../controllers/topicFeed');
const { validateToken } = require('../../middleware/validateToken');
const router = express.Router();
const { defaultLimiter } = require('../../middleware/rateLimiter.js');

router.get('/topic-feed', validateToken, defaultLimiter, topicFeed);

module.exports = router;