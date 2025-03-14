const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { deleteRoom } = require('../../controllers/room');
const { defaultLimiter } = require('../../middleware/rateLimiter');
const router = express.Router();

router.delete('/delete-room/:id', validateToken, defaultLimiter, deleteRoom);

module.exports = router;