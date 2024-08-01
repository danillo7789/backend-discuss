const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { roomFeed } = require('../../controllers/roomFeed');
const router = express.Router();

router.get('/room-feed', validateToken, roomFeed);
//unAuth roomfeed
router.get('/un-auth/room-feed', roomFeed);

module.exports = router;