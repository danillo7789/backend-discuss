const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { updateRoom } = require('../../controllers/room');
const { defaultLimiter } = require('../../middleware/rateLimiter');
const router = express.Router();

router.put('/update-room/:id', validateToken, defaultLimiter, updateRoom);

module.exports = router;