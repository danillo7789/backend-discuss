const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { getRoom } = require('../../controllers/room');
const router = express.Router();

router.get('/room/:id', validateToken, getRoom);

module.exports = router;