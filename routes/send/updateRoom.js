const express = require('express');
const { validateToken } = require('../../middleware/validateToken');
const { updateRoom } = require('../../controllers/room');
const router = express.Router();

router.put('/update-room/:id', validateToken, updateRoom);

module.exports = router;