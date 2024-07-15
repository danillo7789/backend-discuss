const express = require('express');
const { topicFeed } = require('../../controllers/topicFeed');
const { validateToken } = require('../../middleware/validateToken');
const router = express.Router();

router.get('/topic-feed', validateToken, topicFeed);

module.exports = router;